// Add TypeScript declaration for Vite env variables
declare global {
  interface ImportMeta {
    env: {
      VITE_PORT?: string;
      VITE_DOMAIN?: string;
      VITE_API_URL?: string;
      [key: string]: string | undefined;
    };
  }
}

export const env = {
    PORT: import.meta.env.VITE_PORT || "3000",
    DOMAIN: import.meta.env.VITE_DOMAIN || "localhost",
    API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    API_TIMEOUT: 30000,
}