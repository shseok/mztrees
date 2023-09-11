declare global {
  interface Document {
    startViewTransition(callback: () => void): void; // or any
  }
}

export const startViewTransition = document.startViewTransition; // or export {};
