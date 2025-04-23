import { MessageType, Message } from './types';
import { StorageService } from './storage';

/**
 * Background script initialization
 */
function init(): void {
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    if (message.type === MessageType.SEND_EMAIL) {
      handleSendEmail();
    }
  });

  // Listen for installation events
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      // Trigger authentication on install to prompt the user
      chrome.identity.getAuthToken({ interactive: false }, (token) => {
        console.log('Extension installed, OAuth token status:', token ? 'Present' : 'Not available');
      });
    }
  });
}

/**
 * Handle sending email with current tab URL
 */
async function handleSendEmail(): Promise<void> {
  try {
    // Get the current tab URL
    const tabs = await getCurrentTab();
    
    if (!tabs || tabs.length === 0 || !tabs[0].url) {
      sendError('Unable to get current tab URL');
      return;
    }
    
    const currentUrl = tabs[0].url;
    
    // Load settings
    const settings = await StorageService.loadSettings();
    
    // Check if recipients are configured
    if (!settings.recipients) {
      sendError('No recipients configured. Please update settings.');
      return;
    }
    
    // Get auth token for Gmail API
    const token = await getAuthToken();
    
    if (!token) {
      sendError('Failed to authenticate with Gmail. Please sign in to your Google account using the "Authenticate with Gmail" button.');
      return;
    }
    
    // Format email with current URL
    const emailContent = formatEmail(currentUrl, settings.subject, settings.body);
    
    // Send email via Gmail API
    const recipients = settings.recipients.split(',').map(email => email.trim());
    
    for (const recipient of recipients) {
      if (!recipient) continue;
      
      // Send the email to each recipient
      await sendGmailEmail(token, recipient, emailContent.subject, emailContent.body);
    }
    
    // Notify popup of success
    chrome.runtime.sendMessage({ type: MessageType.SEND_EMAIL_SUCCESS });
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('401')) {
      // Clear the cached token and prompt for re-authentication
      await removeCachedToken();
      sendError('Authentication expired. Please authenticate again using the "Authenticate with Gmail" button.');
    } else {
      sendError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
}

/**
 * Get the current active tab
 * @returns Promise with Tab array
 */
function getCurrentTab(): Promise<chrome.tabs.Tab[]> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs);
    });
  });
}

/**
 * Get Gmail API auth token
 * @returns Promise with auth token or undefined if auth fails
 */
function getAuthToken(): Promise<string | undefined> {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        console.error('Auth token error:', chrome.runtime.lastError);
        resolve(undefined);
      } else {
        resolve(token);
      }
    });
  });
}

/**
 * Remove cached auth token when it's invalid or expired
 */
function removeCachedToken(): Promise<void> {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({ interactive: false }, (token) => {
      if (token) {
        chrome.identity.removeCachedAuthToken({ token }, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

/**
 * Format email content with the current URL
 * @param url Current tab URL
 * @param subject Email subject template
 * @param body Email body template
 * @returns Formatted email subject and body
 */
function formatEmail(url: string, subject: string, body: string): { subject: string; body: string } {
  return {
    subject: subject,
    body: body.replace('{url}', url)
  };
}

/**
 * Send email via Gmail API
 * @param token Auth token
 * @param to Recipient email
 * @param subject Email subject
 * @param body Email body
 */
async function sendGmailEmail(token: string, to: string, subject: string, body: string): Promise<void> {
  // Base64 encode the email content
  const emailContent = [
    `From: me`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\r\n');
  
  const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  // Make Gmail API request
  const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      raw: base64EncodedEmail
    })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gmail API error: ${errorData.error?.message || response.statusText}`);
  }
}

/**
 * Send error message to popup
 * @param errorMessage Error message to send
 */
function sendError(errorMessage: string): void {
  const message: Message = {
    type: MessageType.SEND_EMAIL_ERROR,
    data: errorMessage
  };
  
  chrome.runtime.sendMessage(message);
}

// Initialize background script
init(); 