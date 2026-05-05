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
 * Validate name field - only letters and spaces allowed
 */
export const validateName = (name: string): { valid: boolean; error?: string } => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { valid: false, error: "Name is required" };
  }
  
  // Only allow letters (including accents) and spaces
  if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
    return { valid: false, error: "Name can only contain letters and spaces" };
  }
  
  if (trimmed.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }
  
  if (trimmed.length > 100) {
    return { valid: false, error: "Name must not exceed 100 characters" };
  }
  
  return { valid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password.trim()) {
    return { valid: false, error: "Password is required" };
  }
  
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }
  
  if (password.length > 128) {
    return { valid: false, error: "Password must not exceed 128 characters" };
  }
  
  return { valid: true };
};

/**
 * Validate quantity field - numeric range
 */
export const validateQuantity = (
  quantity: string,
  min: number = 1,
  max: number = 10000
): { valid: boolean; error?: string } => {
  if (!quantity.trim()) {
    return { valid: false, error: "Quantity is required" };
  }
  
  const num = parseInt(quantity);
  
  if (isNaN(num)) {
    return { valid: false, error: "Quantity must be a number" };
  }
  
  if (num < min) {
    return { valid: false, error: `Quantity must be at least ${min}` };
  }
  
  if (num > max) {
    return { valid: false, error: `Quantity cannot exceed ${max}` };
  }
  
  return { valid: true };
};

/**
 * Validate alphanumeric field with spaces and basic special chars
 */
export const validateAlphanumeric = (
  value: string,
  fieldName: string = "Field",
  minLength: number = 1,
  maxLength: number = 255
): { valid: boolean; error?: string } => {
  const trimmed = value.trim();
  
  if (!trimmed) {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  // Allow letters, numbers, spaces, hyphens, underscores, parentheses
  if (!/^[a-zA-Z0-9\s\-_()]+$/.test(trimmed)) {
    return { 
      valid: false, 
      error: `${fieldName} can only contain letters, numbers, spaces, hyphens, and underscores` 
    };
  }
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }
  
  return { valid: true };
};

/**
 * Validate RFID UID - alphanumeric only
 */
export const validateRFIDUID = (rfidUid: string): { valid: boolean; error?: string } => {
  const trimmed = rfidUid.trim();
  
  if (!trimmed) {
    return { valid: true }; // RFID is optional
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
    return { valid: false, error: "RFID UID can only contain letters and numbers" };
  }
  
  if (trimmed.length < 3) {
    return { valid: false, error: "RFID UID must be at least 3 characters" };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: "RFID UID must not exceed 50 characters" };
  }
  
  return { valid: true };
};
