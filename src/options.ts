import { Settings } from './types';
import { StorageService } from './storage';

/**
 * Initialize the options page
 */
async function initOptions(): Promise<void> {
  const recipientsInput = document.getElementById('recipients') as HTMLInputElement;
  const subjectInput = document.getElementById('subject') as HTMLInputElement;
  const bodyTextarea = document.getElementById('body') as HTMLTextAreaElement;
  const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
  const authButton = document.getElementById('authButton') as HTMLButtonElement;
  const statusMessage = document.getElementById('statusMessage') as HTMLDivElement;
  
  if (!recipientsInput || !subjectInput || !bodyTextarea || !saveButton || !authButton || !statusMessage) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Load saved settings
  try {
    const settings = await StorageService.loadSettings();
    
    recipientsInput.value = settings.recipients;
    subjectInput.value = settings.subject;
    bodyTextarea.value = settings.body;
  } catch (error) {
    console.error('Error loading settings:', error);
    statusMessage.textContent = 'Error loading settings';
  }
  
  // Save button click handler
  saveButton.addEventListener('click', async () => {
    try {
      // Validate email addresses
      const recipients = recipientsInput.value.trim();
      const emailList = recipients.split(',').map(email => email.trim());
      
      // Basic email validation
      const invalidEmails = emailList.filter(email => email !== '' && !isValidEmail(email));
      
      if (invalidEmails.length > 0) {
        statusMessage.textContent = `Invalid email format: ${invalidEmails.join(', ')}`;
        return;
      }
      
      // Create settings object
      const settings: Settings = {
        recipients,
        subject: subjectInput.value.trim(),
        body: bodyTextarea.value.trim()
      };
      
      // Save settings
      await StorageService.saveSettings(settings);
      
      // Show success message (briefly)
      statusMessage.textContent = 'Settings saved successfully';
      statusMessage.style.color = '#4285f4';
      
      // Clear message after 2 seconds
      setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.style.color = '';
      }, 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
      statusMessage.textContent = `Error saving settings: ${error instanceof Error ? error.message : 'Unknown error'}`;
      statusMessage.style.color = '#d93025';
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
          statusMessage.style.color = '#d93025';
          return;
        }
        
        if (token) {
          statusMessage.style.color = '#4285f4';
          statusMessage.textContent = 'Successfully authenticated with Gmail!';
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.style.color = '';
          }, 3000);
        } else {
          statusMessage.textContent = 'Failed to authenticate. Please try again.';
          statusMessage.style.color = '#d93025';
        }
      });
    } catch (error) {
      console.error('Error during authentication:', error);
      statusMessage.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      statusMessage.style.color = '#d93025';
      
      // Re-enable button
      authButton.disabled = false;
      authButton.textContent = 'Authenticate with Gmail';
    }
  });
}

/**
 * Validate email format using regex
 * @param email Email address to validate
 * @returns True if email format is valid
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Initialize options when DOM is loaded
document.addEventListener('DOMContentLoaded', initOptions); 