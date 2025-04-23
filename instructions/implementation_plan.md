# Implementation plan

## Phase 1: Environment Setup

1. **Prevalidation:** Check if the current directory already contains a Chrome extension project (e.g., look for an existing `manifest.json`). If found, avoid reinitializing the project. *(Project Requirements: Overall Project Setup)*

2. **Project Directory Structure:** Create the necessary directories if they do not exist:
   - Create a root-level `manifest.json` file.
   - Create directories for scripts (e.g., `/scripts`), popup UI (e.g., `/popup`), and options/settings page (e.g., `/options`). *(Project Requirements: App Structure)*

3. **Create Manifest File:** In the project root, create a file named `manifest.json` with the following specifications:
   - Use Chrome Extension Manifest V3.
   - Specify required permissions: `activeTab`, `identity`, `storage`, and `https://mail.google.com/`.
   - Define the background service worker (pointing to your background script file), the action (for the toolbar icon), default popup page, and icons. *(Manifest File, Chrome Extension Manifest V3 Implementation)*

4. **Optional AI Tool Setup (Cursor):**
   - If using Cursor for development assistance, create a `.cursor` directory in the root if it doesn’t exist.
   - Inside `.cursor`, create a file named `mcp.json` if it doesn’t exist.
   - Add `.cursor/mcp.json` to your `.ignore` file.
   - Display the following configuration for macOS:
     ```json
     { "mcpServers": { "supabase": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-postgres", "<connection-string>"] } } }
     ```
     or for Windows:
     ```json
     { "mcpServers": { "supabase": { "command": "cmd", "args": ["/c", "npx", "-y", "@modelcontextprotocol/server-postgres", "<connection-string>"] } } }
     ```
   - Provide the link to get the connection string: [https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp](https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp). Replace `<connection-string>` after obtaining it. *(Developer Instructions: Environment Setup for AI Tools)*

## Phase 2: Chrome Extension Core Implementation

5. **Manifest File Details:** Edit `manifest.json` to include key properties as follows (example snippet):
   ```json
   {
     "manifest_version": 3,
     "name": "Email URL Extension",
     "version": "1.0",
     "action": {
       "default_popup": "popup.html",
       "default_icon": "icons/icon48.png"
     },
     "background": {
       "service_worker": "background.ts"
     },
     "permissions": [
       "activeTab",
       "identity",
       "storage",
       "https://mail.google.com/"
     ],
     "options_page": "options.html"
   }
   ```
   *(Project Requirements: Manifest File)*

6. **Background Script Implementation:**
   - Create `background.ts` in the project root (or inside a `/scripts` folder if preferred). *(File Path: `/background.ts`)*
   - Within `background.ts`, use `chrome.action.onClicked.addListener` (or rely on a message from the popup) to trigger the email sending process.
   - Implement the OAuth2 flow using `chrome.identity.getAuthToken` with the interactive flag set to true. *(Project Requirements: OAuth2 Authentication)*

7. **Get Current Tab URL:**
   - In `background.ts`, use `chrome.tabs.query` to fetch the URL of the currently active tab. *(Project Requirements: One-Click Email)*

8. **Gmail API Integration in Background Script:**
   - Construct the API request in `background.ts` to send an email via the Gmail API using the access token obtained from OAuth2.
   - Ensure the email is sent to the predefined recipient(s) with subject and body as configured. *(Project Requirements: Gmail API Integration & Multiple Recipient Support)*

9. **Implement Error Handling in Background Script:**
   - Add error handling in `background.ts` so that if the OAuth2 token retrieval fails or if the API call to send an email fails, the error is caught.
   - Log the error and send a message to the popup for display. *(Project Requirements: Error Handling)*

10. **Popup UI Setup:**
    - Create `popup.html` in the project root (or in `/popup`). This file should include:
      - An "Email URL" button that, when clicked, triggers the email sending process.
      - A link to open the settings/options page.
      - An area (e.g., a div) to display error messages.
      *(Project Requirements: Popup UI)*

11. **Popup Script Implementation:**
    - Create `popup.ts` (or `popup.js`) and link it in `popup.html`.
    - Add event listeners to the "Email URL" button which sends a message to the background script to start the email process.
    - Listen for any error messages from the background script and display them in the popup UI. *(Project Requirements: Error Handling)*

12. **Options / Settings Page Development:**
    - Create `options.html` for the settings page where users can configure:
      - Recipient email address(es) (support comma-separated values for multiple recipients).
      - Email subject.
      - Email body.
      *(Project Requirements: Customizable Settings & Multiple Recipient Support)*

13. **Options Script Implementation:**
    - Create `options.ts` (or `options.js`) and link it in `options.html`.
    - Use `chrome.storage.sync` to save user settings and retrieve them when the options page loads.
    - Validate the user input to ensure proper email formatting if necessary. *(Project Requirements: Data Storage)*

## Phase 3: OAuth2 & Gmail API Integration

14. **OAuth2 Client Credentials:**
    - Instruct the user to obtain OAuth2 client credentials from the Google Cloud Console.
    - Ensure the correct redirect URI is configured for the extension (as per Gmail API guidelines).
    - Add comments/placeholders in your code (especially in `background.ts`) where these credentials should be inserted. *(Project Requirements: OAuth2 Authentication)*

15. **Gmail API Request Configuration:**
    - In `background.ts`, integrate the Gmail API call using the obtained OAuth2 token.
    - Loop through the list of recipient email addresses (split by commas) to send the email to each recipient. *(Project Requirements: Multiple Recipient Support)*

## Phase 4: Integration & Validation

16. **Integrate Popup and Background Communication:**
    - Validate that clicking the "Email URL" button in `popup.html` correctly triggers the appropriate function in `background.ts` via message passing.
    - Confirm the error message area in the popup displays issues reported from the background script. *(Project Requirements: One-Click Email, Error Handling)*

17. **Test OAuth2 Flow and Gmail API Call:**
    - Launch the extension in Chrome (by loading it as an unpacked extension).
    - Click the extension icon to trigger OAuth2 authentication. Verify that the access token is successfully obtained and that the Gmail API receives the call with proper credentials.
    - Check the console logs for any error messages in both background and popup scripts. *(Project Requirements: Security & Error Handling)*

18. **Validate Settings Persistence:**
    - Open the options page and modify the recipient, subject, and body settings.
    - Confirm these settings are saved using `chrome.storage.sync` and are correctly used when sending the email. *(Project Requirements: Customizable Settings)*

## Phase 5: Documentation & Final Checks

19. **Documentation:**
    - Create a `README.md` file documenting the extension’s purpose, setup instructions, how to obtain and configure OAuth2 client credentials, and any other necessary information.
    *(Project Requirements: Overall Project Documentation)*

20. **Final Validation:**
    - Re-check the entire project directory to ensure all files are in place and that the project adheres to the Manifest V3 requirements.
    - Verify that error handling is robust and that no confirmation messages are displayed upon email send success (only errors are shown when needed).
    - If using Cursor, verify your `.cursor/mcp.json` configuration is updated with the connection string retrieved from [https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp](https://supabase.com/docs/guides/getting-started/mcp#connect-to-supabase-using-mcp).

---
*Note: This implementation plan adheres strictly to the provided project requirements, tech stack (TypeScript, JavaScript with Chrome Extension Manifest V3, Gmail API, and OAuth2), and user preferences. Ensure that all API calls, error messages, and settings configurations follow the outlined specifications for security, performance, and lightweight operation.*