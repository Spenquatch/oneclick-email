// Type definitions for Chrome extension API
declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | object | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: object, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
      clear(callback?: () => void): void;
    }
    
    const sync: StorageArea;
    const local: StorageArea;
  }
  
  namespace runtime {
    const lastError: chrome.runtime.LastError | undefined;
    
    interface LastError {
      message?: string;
    }
    
    interface InstalledDetails {
      reason: "install" | "update" | "chrome_update" | "shared_module_update";
      previousVersion?: string;
    }
    
    function getURL(path: string): string;
    function sendMessage(message: any, responseCallback?: (response: any) => void): void;
    function openOptionsPage(callback?: () => void): void;
    
    const onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void): void;
      removeListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void): void;
    };
    
    const onInstalled: {
      addListener(callback: (details: InstalledDetails) => void): void;
      removeListener(callback: (details: InstalledDetails) => void): void;
    };
  }
  
  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
    }
    
    function query(queryInfo: object, callback: (result: Tab[]) => void): void;
  }
  
  namespace identity {
    function getAuthToken(details: { interactive: boolean }, callback: (token?: string) => void): void;
    function removeCachedAuthToken(details: { token: string }, callback?: () => void): void;
    function clearAllCachedAuthTokens(callback?: () => void): void;
    function launchWebAuthFlow(details: { url: string; interactive: boolean }, callback: (responseUrl?: string) => void): void;
    function getRedirectURL(): string;
  }
} 