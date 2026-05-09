import { Asset } from "./types";

const ASSETS_STORAGE_KEY = "sdca_assets";

export const assetUtils = {
  /**
   * Get all assets from localStorage
   */
  getAssets: (): Asset[] => {
    if (globalThis.window === undefined) return [];
    try {
      const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to get assets from localStorage:", error);
      return [];
    }
  },

  /**
   * Save a new asset to localStorage
   */
  saveAsset: (asset: Omit<Asset, "id" | "createdAt">): Asset => {
    const assets = assetUtils.getAssets();
    const newAsset: Asset = {
      ...asset,
      id: `asset_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    assets.push(newAsset);
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
    return newAsset;
  },

  /**
   * Update an existing asset
   */
  updateAsset: (id: string, updates: Partial<Asset>): Asset | null => {
    const assets = assetUtils.getAssets();
    const index = assets.findIndex((a) => a.id === id);
    if (index === -1) return null;
    assets[index] = { ...assets[index], ...updates };
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
    return assets[index];
  },

  /**
   * Delete an asset
   */
  deleteAsset: (id: string): boolean => {
    const assets = assetUtils.getAssets();
    const filtered = assets.filter((a) => a.id !== id);
    if (filtered.length === assets.length) return false;
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Clear all assets
   */
  clearAssets: (): void => {
    localStorage.removeItem(ASSETS_STORAGE_KEY);
  },
};

/**
 * Validate email format for SDCA domain
 */
export const validateSDCAEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith("@sdca.edu.ph");
};

/**
 * Authentication utilities
 */
export const authUtils = {
  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const user = localStorage.getItem("user");
      return user ? true : false;
    } catch (error) {
      console.error("Failed to check authentication:", error);
      return false;
    }
  },

  /**
   * Get current user data
   */
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to get current user:", error);
      return null;
    }
  },

  /**
   * Logout user
   */
  logout: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  },
};
