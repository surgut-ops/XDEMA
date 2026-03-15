// store/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User { id: number; name: string; email: string; role: string; }
interface UserStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => {
        set({ user, token });
        if (typeof window !== 'undefined') localStorage.setItem('xdema_token', token);
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') localStorage.removeItem('xdema_token');
      },
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    { name: 'xdema-user' }
  )
);

// store/useSettingsStore.ts
import { create as createSettings } from 'zustand';

interface Settings {
  hero: any;
  contacts: any;
  heroBg: any;
  blocks: any;
  colors: any;
  popupSettings: any;
  djPrices: any[];
  qrPrices: any;
  gallSettings: any;
  courses: any[];
  gallery: any[];
}

interface SettingsStore {
  settings: Partial<Settings>;
  loaded: boolean;
  setSettings: (s: Partial<Settings>) => void;
  setSetting: (key: string, value: any) => void;
}

export const useSettingsStore = createSettings<SettingsStore>((set) => ({
  settings: {},
  loaded: false,
  setSettings: (s) => set({ settings: s, loaded: true }),
  setSetting: (key, value) => set((state) => ({ settings: { ...state.settings, [key]: value } })),
}));

// store/useModalStore.ts
import { create as createModal } from 'zustand';

interface ModalStore {
  auth: boolean;
  pay: boolean;
  book: boolean;
  req: boolean;
  qr: { open: boolean; type: string };
  payItem: string;
  payAmount: number;
  payKey: string;
  openAuth: () => void;
  openPay: (item?: string, amount?: number, courseKey?: string) => void;
  openBook: () => void;
  openReq: () => void;
  openQr: (type: string) => void;
  closeAll: () => void;
}

export const useModalStore = createModal<ModalStore>((set) => ({
  auth: false,
  pay: false,
  book: false,
  req: false,
  qr: { open: false, type: 'track' },
  payItem: '',
  payAmount: 0,
  payKey: '',
  openAuth: () => set({ auth: true }),
  openPay: (item = '', amount = 0, courseKey = '') =>
    set({ pay: true, payItem: item, payAmount: amount, payKey: courseKey }),
  openBook: () => set({ book: true }),
  openReq: () => set({ req: true }),
  openQr: (type) => set({ qr: { open: true, type } }),
  closeAll: () =>
    set({
      auth: false,
      pay: false,
      book: false,
      req: false,
      qr: { open: false, type: 'track' },
      payItem: '',
      payAmount: 0,
      payKey: '',
    }),
}));

// store/usePerformanceStore.ts
import { create as createPerf } from 'zustand';
import { persist as persistPerf } from 'zustand/middleware';

interface PerfStore {
  perfMode: boolean;
  toggle: () => void;
}
export const usePerformanceStore = createPerf<PerfStore>()(
  persistPerf(
    (set, get) => ({
      perfMode: false,
      toggle: () => {
        const next = !get().perfMode;
        set({ perfMode: next });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('perf', next);
        }
      },
    }),
    { name: 'xdema-perf' }
  )
);
