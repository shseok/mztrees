declare global {
  interface Window {
    beforeInstallPromptEvent: BeforeInstallPromptEvent;
  }
  interface Navigator {
    standalone?: boolean;
  }
  interface Document {
    startViewTransition(callback: () => void): void; // or any
  }
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const startViewTransition = document.startViewTransition; // or export {};
