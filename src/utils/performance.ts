// Performance utilities for optimizing React Native apps on low-end devices

import { InteractionManager } from 'react-native';

/**
 * Debounce function to limit the rate of function calls
 * Useful for search inputs and scroll handlers
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to ensure function is called at most once per specified time
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Run a task after all interactions and animations are complete
 * Helps prevent janky UI on low-end devices
 */
export const runAfterInteractions = (task: () => void): void => {
  InteractionManager.runAfterInteractions(() => {
    task();
  });
};

/**
 * Batch updates to reduce re-renders
 */
export const batchUpdate = (updates: Array<() => void>): void => {
  runAfterInteractions(() => {
    updates.forEach(update => update());
  });
};

/**
 * Memory-efficient image size calculator
 * Returns optimal image dimensions for display
 */
export const getOptimalImageSize = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
  return {
    width: Math.floor(originalWidth * ratio),
    height: Math.floor(originalHeight * ratio),
  };
};

/**
 * Check if device is considered low-end based on memory
 * This is a simple heuristic
 */
export const isLowEndDevice = (): boolean => {
  // You can implement more sophisticated checks here
  // For now, we assume all devices might be low-end and optimize accordingly
  return true;
};

/**
 * Lazy load helper for heavy components
 */
export const lazyLoad = <T,>(
  importFunc: () => Promise<{ default: T }>,
  delay: number = 0
): Promise<{ default: T }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      importFunc().then(resolve);
    }, delay);
  });
};
