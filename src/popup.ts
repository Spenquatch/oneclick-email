import { MessageType, Message } from './types';

/**
 * Initialize the popup UI and event listeners
 */
function initPopup(): void {
  const emailUrlButton = document.getElementById('emailUrlButton') as HTMLButtonElement;
  const authButton = document.getElementById('authButton') as HTMLButtonElement;
  const settingsLink = document.getElementById('settingsLink') as HTMLAnchorElement;
  const statusMessage = document.getElementById('statusMessage') as HTMLDivElement;
  
  if (!emailUrlButton || !authButton || !settingsLink || !statusMessage) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Email URL button click handler
  emailUrlButton.addEventListener('click', async () => {
    try {
      // Clear any previous status messages
      statusMessage.textContent = '';
      
      // Disable button while processing
      emailUrlButton.disabled = true;
      emailUrlButton.textContent = 'Sending...';
      
      // Send message to background script to email URL
      const message: Message = { type: MessageType.SEND_EMAIL };
      chrome.runtime.sendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
      statusMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      // Re-enable button
      emailUrlButton.disabled = false;
      emailUrlButton.textContent = 'Email URL';
    }
  });
  
  // Auth button click handler
  authButton.addEventListener('click', async () => {
    try {
      // Clear any previous status messages
      statusMessage.textContent = '';
      
      // Disable button while processing
      authButton.disabled = true;
      authButton.textContent = 'Authenticating...';
      
      // Try to get an auth token to check authentication
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        // Re-enable button
        authButton.disabled = false;
        authButton.textContent = 'Authenticate with Gmail';
        
        if (chrome.runtime.lastError) {
          console.error('Auth error:', chrome.runtime.lastError);
          statusMessage.textContent = `Authentication failed: ${chrome.runtime.lastError.message || 'Unknown error'}`;
          return;
        }
        
        if (token) {
          statusMessage.style.color = '#4285f4';
          statusMessage.textContent = 'Successfully authenticated with Gmail!';
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.style.color = '#d93025'; // Reset to error color
          }, 3000);
        } else {
          statusMessage.textContent = 'Failed to authenticate. Please try again.';
        }
      });
    } catch (error) {
      console.error('Error during authentication:', error);
      statusMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      // Re-enable button
      authButton.disabled = false;
      authButton.textContent = 'Authenticate with Gmail';
    }
  });
  
  // Settings link click handler
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message: Message) => {
    // Re-enable button
    emailUrlButton.disabled = false;
    emailUrlButton.textContent = 'Email URL';
    
    if (message.type === MessageType.SEND_EMAIL_ERROR) {
      statusMessage.textContent = `Error: ${message.data}`;
    } else if (message.type === MessageType.SEND_EMAIL_SUCCESS) {
      statusMessage.style.color = '#4285f4';
      statusMessage.textContent = 'Email sent successfully!';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.style.color = '#d93025'; // Reset to error color
      }, 3000);
    }
  });
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initPopup); 