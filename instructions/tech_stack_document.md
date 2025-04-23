# Tech Stack Document

This document explains the technology choices used for creating a lightweight Chrome extension that allows users to send the URL of their current browser tab to a predefined email address with just one click. The intention is to keep things simple, streamlined, and user-friendly. Here is a breakdown of the key technologies and how they work together:

## Frontend Technologies

The frontend is where the user interacts with the extension. We focus on tools that allow for a smooth and intuitive user experience, especially considering the context of a Chrome extension:

*   **TypeScript & JavaScript**:

    *   These languages power the logic and interactivity of our extension. TypeScript adds a layer of safety by catching errors early during development, making the code more reliable and maintainable.
    *   Plain JavaScript is used where needed, ensuring compatibility and quick execution in the browser environment.

*   **Chrome Extension Manifest V3**:

    *   This is the official framework for building Chrome extensions. It specifies how the extension behaves, its permissions, and how components such as background scripts and the dropdown UI interact with the browser.

*   **User Interface Elements**:

    *   A simple dropdown menu that shows an "Email URL" button and a settings option. This interface is designed to be minimal and intuitive so that anyone can use it without a steep learning curve.

## Backend Technologies

Although this project doesn’t rely on a complex backend, critical functionalities need reliable services that handle authentication and external communication:

*   **Gmail API**:

    *   Serves as the bridge to send emails directly from the extension. When you click the button, the extension retrieves the current tab's URL and sends it as an email using this API.

*   **OAuth2 Authentication**:

    *   Provides a secure and standardized way to authenticate with Gmail. This ensures that only authorized actions are taken using the user's provided client credentials. If authentication fails or the user isn’t logged in, clear error messages will inform the user of the issue.

## Infrastructure and Deployment

To ensure smooth operation and reliable updates, the following choices are made regarding infrastructure and deployment:

*   **Chrome Web Store**:

    *   The extension is distributed and updated through the Chrome Web Store, which guarantees easy installation and automatic updates for users.

*   **Version Control Systems**:

    *   Tools like Git ensure that the source code is versioned properly. This aids in collaboration, keeping track of changes, and maintaining a history of updates.

*   **CI/CD Pipelines (Optional but Recommended)**:

    *   Continuous Integration/Continuous Deployment pipelines help automate testing, building, and deployment processes. While not extensive for this lightweight extension, having a CI/CD process supports consistent delivery and reliability.

## Third-Party Integrations

This project leverages external services to enhance its functionality without reinventing the wheel:

*   **Gmail API**:

    *   As mentioned, it is used to send emails by securely interfacing with Gmail.

*   **OAuth2 via Google**:

    *   Manages the authentication process, ensuring that users’ credentials are safely handled without exposing sensitive information.

*   **Chrome Storage**:

    *   Utilized for storing user settings like recipient email addresses, email subjects, and body text. This storage is synchronized across devices, ensuring a consistent user experience.

## Security and Performance Considerations

Security and performance are crucial, even in a simple, one-click extension:

*   **Security Measures**:

    *   OAuth2 provides robust authentication, ensuring that only authorized email send actions occur.
    *   The extension is built with Chrome’s security best practices in mind, utilizing the sandboxed environment provided by Manifest V3.

*   **Performance Optimizations**:

    *   Minimal user interface designs and efficient code ensure that the extension loads quickly and does not hamper the browser’s performance.
    *   The use of Chrome Storage for data management contributes to responsive settings management without additional backend processing.

## Conclusion and Overall Tech Stack Summary

To sum up, this tech stack was chosen to streamline and secure the process of sending the current browser tab's URL via email:

*   Frontend components (TypeScript, JavaScript, and Manifest V3) ensure that the user interface is intuitive and efficient.
*   The integration of the Gmail API paired with OAuth2 covers the required email functionality and user authentication securely.
*   Infrastructure choices, including distribution via the Chrome Web Store and optional CI/CD pipelines, enable reliable deployment and updates.
*   Third-party integrations, such as Chrome Storage and OAuth2, add extra reliability and security.
*   Overall, the technology choices align perfectly with the project’s goals: simplifying a tedious task while maintaining security, performance, and ease of use.

This stack not only meets the current requirements but also leaves room for future improvements, such as adding more customizable features if needed, without affecting the project’s performance or simplicity.
