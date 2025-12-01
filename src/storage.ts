// storage.ts
export const STORAGE_KEY = "prize-wheel:prizes-v2";
export const TITLE_KEY = "prize-wheel:title-v1";
export const CENTER_IMAGE_KEY = "prize-wheel:center-image-v1";
export const PASSWORD_KEY = "prize-wheel:settings-password-v1";
export const CUSTOM_COLORS_KEY = "prize-wheel:custom-colors-v1";

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  async removeItem(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
