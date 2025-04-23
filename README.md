# OneClick Email - Chrome Extension

A lightweight Chrome extension that allows you to quickly send the URL of your current tab to one or more predefined email addresses with a single click.

## Features

- One-click URL sharing via Gmail
- Multiple recipient support
- Customizable email subject and body
- Settings synchronized across devices
- Minimal permissions required

## Installation

### From Source

1. Clone this repository or download it as a ZIP file
2. Build the extension:
   ```
   npm install
   npm run build
   ```
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top-right corner
5. Click "Load unpacked" and select the `dist` directory created by the build process
6. **Important**: After building, you must add your Google OAuth Client ID to the `manifest.json` file in the `dist` folder:
   - Open `dist/manifest.json`
   - Locate the "oauth2" section
   - Replace the placeholder client ID with your actual Client ID from Google Cloud Console
   - Save the file before loading the extension in Chrome

## Setup

### Google Cloud Console Setup (Required)

This extension requires OAuth2 credentials to authenticate with the Gmail API. Follow these detailed steps to set up your credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click on the project dropdown at the top of the page
   - Click "New Project"
   - Enter a name for your project and click "Create"

3. Enable the Gmail API:
   - In the left sidebar, click "APIs & Services" > "Library"
   - Search for "Gmail API" and click on it
   - Click "Enable"

4. Configure the OAuth consent screen:
   - In the left sidebar, click "APIs & Services" > "OAuth consent screen"
   - Select "External" user type and click "Create"
   - Fill in the required fields (App name, User support email, Developer email)
   - Click "Save and Continue"
   - Add the scope: `.../auth/gmail.send` and click "Save and Continue"
   - Add your email as a test user and click "Save and Continue"
   - Click "Back to Dashboard"

5. Create OAuth2 credentials:
   - In the left sidebar, click "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Chrome Extension" as the application type
   - Enter a name for your credentials

6. Find your Chrome extension ID:
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Find your extension and copy the ID (a long string of letters and numbers)

7. Complete OAuth2 configuration:
   - Return to the Google Cloud Console credentials page
   - Paste your extension ID in the "Extension ID" field
   - Click "Create"
   - Copy the generated Client ID

8. Update the extension manifest:
   - Open the `manifest.json` file in your extension directory
   - Replace `"YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"` with your generated Client ID
   - Save the file
   - Reload the extension in Chrome

### Authenticating with Gmail

Before you can use the extension, you need to authenticate with Gmail:

1. After installing the extension, click on the extension icon in the toolbar
2. Click the "Authenticate with Gmail" button
3. Follow the Google sign-in prompts to grant the extension permission to send emails
4. Once authenticated, you'll see a success message

If you encounter authentication errors later, you can re-authenticate using the same button.

### Extension Configuration

1. After installing the extension and authenticating, click the "Settings" link
2. Configure one or more recipient email addresses (comma-separated)
3. Customize the subject line and body text (use {url} as a placeholder for the URL)
4. Click "Save Settings"

## Usage

1. Navigate to any webpage you want to share
2. Click the extension icon in the toolbar
3. Click the "Email URL" button
4. The URL will be sent via Gmail to your configured recipients

## Troubleshooting

### Authentication Issues

If you see "Failed to authenticate with Gmail" or "bad client id" errors:

1. Verify your client ID is correct:
   - Check the `dist/manifest.json` file to ensure the client ID is correct
   - Verify the client ID matches the one generated in Google Cloud Console
   - Make sure you're using the correct extension ID in Google Cloud Console

2. Verify OAuth consent screen configuration:
   - Check that the Gmail API is enabled
   - Ensure the gmail.send scope is properly configured
   - Verify your email is added as a test user

3. Try re-authorizing:
   - Click the "Authenticate with Gmail" button
   - Make sure you're signed in to your Google account in Chrome
   - Grant the necessary permissions when prompted

If problems persist:
1. Go to `chrome://extensions`
2. Find the URL Gmail Send extension
3. Click "Details" then "Extension options"
4. Click "Authenticate with Gmail" again

## Privacy and Permissions

This extension requires the following permissions:
- `activeTab`: To access the URL of your current tab
- `identity`: For OAuth2 authentication with Gmail
- `storage`: To store your settings

The extension does not collect or store any personal data beyond what's needed for the core functionality.

## Development

### Build Commands

- `npm run build`: Build the extension for production
- `npm run dev`: Build with watch mode for development

### Project Structure

- `src/`: TypeScript source files
- `popup/`: Popup UI files
- `options/`: Settings page files
- `icons/`: Extension icons
- `dist/`: Build output (generated)

## License

MIT