/**
 * Settings interface for storing user configuration
 */
export interface Settings {
  /** Email recipients (comma-separated) */
  recipients: string;
  /** Email subject line */
  subject: string;
  /** Email body template with {url} placeholder */
  body: string;
}

/**
 * Default settings values
 */
export const DEFAULT_SETTINGS: Settings = {
  recipients: '',
  subject: 'Check out this link',
  body: 'I thought you might find this interesting: {url}'
};

/**
 * Message types for communication between background and popup
 */
export enum MessageType {
  SEND_EMAIL = 'send_email',
  SEND_EMAIL_SUCCESS = 'send_email_success',
  SEND_EMAIL_ERROR = 'send_email_error'
}

/**
 * Message interface for communication between components
 */
export interface Message {
  type: MessageType;
  data?: any;
} 