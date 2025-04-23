flowchart TD
    A[User clicks extension icon]
    A --> B[Show dropdown with Email URL and Settings options]
    B --> C{User selects action}
    C -->|Email URL| D[Retrieve current tab URL]
    D --> E[Authenticate via Gmail API using OAuth2]
    E --> F[Send email using Gmail API]
    F --> G{Email sent successfully}
    G -->|Yes| H[Complete action with no confirmation]
    G -->|No| I[Display error message]
    C -->|Settings| J[Navigate to settings screen]
    J --> K[Configure recipient addresses, subject, and body]
    K --> L[Store settings in Chrome Storage]
    L --> M[Settings updated successfully]