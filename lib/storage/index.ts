import { LocalStorageAdapter } from './LocalStorageAdapter';
import { ApiAdapter } from './ApiAdapter';
import type { StorageAdapter } from '@/types/goal';

export function getStorageAdapter(): StorageAdapter {
  const mode = process.env.NEXT_PUBLIC_STORAGE_MODE;
  if (mode === 'production') {
    return new ApiAdapter();
  }
  if (mode && mode !== 'demo') {
    console.warn(`[doit] Unknown NEXT_PUBLIC_STORAGE_MODE "${mode}", falling back to demo mode`);
  }
  return new LocalStorageAdapter();
}
