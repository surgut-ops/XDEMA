'use client';
import { useEffect } from 'react';
import { settingsApi } from '@/lib/api';
import { useSettingsStore } from '@/store';
import { usePerformanceStore } from '@/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const { setSettings } = useSettingsStore();
  const { perfMode } = usePerformanceStore();

  useEffect(() => {
    // Apply saved performance mode
    if (perfMode) document.documentElement.classList.add('perf');
    // Load settings from API
    settingsApi
      .getAll()
      .then((res: any) => setSettings(res as any))
      .catch(() => {});
    // Apply saved theme
    const theme = localStorage.getItem('xdema-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return <>{children}</>;
}
