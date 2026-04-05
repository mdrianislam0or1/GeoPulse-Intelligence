"import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8040/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 + token refresh
let isRefreshing = false;
let failedQueue: { resolve: (v: unknown) => void; reject: (e: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newToken = data.data.token;
        const newRefreshToken = data.data.refreshToken;

        Cookies.set('accessToken', newToken, { expires: 200 });
        Cookies.set('refreshToken', newRefreshToken, { expires: 200 });

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
"

"import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8040';

let socket: Socket | null = null;

export const connectSocket = (): Socket => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = (): Socket | null => socket;

export const joinAdminRoom = () => {
  socket?.emit('join_admin_room');
};

export const joinBranchRoom = (branchId: string) => {
  socket?.emit('join_branch_room', branchId);
};

export const joinCashierRoom = (userId: string) => {
  socket?.emit('join_cashier_room', userId);
};

// Socket event names (matching backend)
export const SOCKET_EVENTS = {
  NEW_ORDER: 'new_order',
  ORDER_REFUNDED: 'order_refunded',
  INVENTORY_UPDATED: 'inventory_updated',
  LOW_STOCK_ALERT: 'low_stock_alert',
  RECEIPT_READY: 'receipt_ready',
  AI_INSIGHT_READY: 'ai_insight_ready',
  CASH_REGISTER_ALERT: 'cash_register_alert',
  DAILY_REPORT_READY: 'daily_report_ready',
} as const;
"

"import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function printReceiptFromBase64(receiptUrl: string) {
  // receiptUrl is a data:application/pdf;base64,... string
  const byteCharacters = atob(receiptUrl.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getSegmentColor(segment: string): string {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    regular: 'bg-green-100 text-green-700',
    vip: 'bg-amber-100 text-amber-700',
    churn_risk: 'bg-red-100 text-red-700',
  };
  return colors[segment] || 'bg-gray-100 text-gray-700';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-700',
    refunded: 'bg-red-100 text-red-700',
    partial_refund: 'bg-orange-100 text-orange-700',
    cancelled: 'bg-gray-100 text-gray-700',
    open: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-gray-100 text-gray-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}
"

"'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
"


"'use client';

import { getSocket, SOCKET_EVENTS } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';
import type { SocketLowStock, SocketNewOrder, SocketOrderRefunded, SocketReceiptReady } from '@/types';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  lastReceiptUrl: string | null;
  lastReceiptOrderId: string | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  lastReceiptUrl: null,
  lastReceiptOrderId: null,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastReceiptUrl, setLastReceiptUrl] = useState<string | null>(null);
  const [lastReceiptOrderId, setLastReceiptOrderId] = useState<string | null>(null);

  const handleNewOrder = useCallback((data: SocketNewOrder) => {
    toast.success(`New order #${data.orderNumber} — ৳${data.grandTotal.toFixed(2)}`, {
      duration: 5000,
      icon: '🛒',
    });
  }, []);

  const handleOrderRefunded = useCallback((data: SocketOrderRefunded) => {
    toast(`Order refunded — ৳${data.refundAmount.toFixed(2)}`, {
      duration: 5000,
      icon: '↩️',
    });
  }, []);

  const handleLowStock = useCallback((data: SocketLowStock) => {
    toast.error(`Low stock alert: ${data.quantity} units remaining (threshold: ${data.threshold})`, {
      duration: 8000,
      icon: '⚠️',
    });
  }, []);

  const handleReceiptReady = useCallback((data: SocketReceiptReady) => {
    setLastReceiptUrl(data.receiptUrl);
    setLastReceiptOrderId(data.orderId);
    toast.success('Receipt is ready! Click to print.', {
      duration: 10000,
      icon: '🧾',
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const s = getSocket();
      setSocket(s);

      if (s) {
        s.on(SOCKET_EVENTS.NEW_ORDER, handleNewOrder);
        s.on(SOCKET_EVENTS.ORDER_REFUNDED, handleOrderRefunded);
        s.on(SOCKET_EVENTS.LOW_STOCK_ALERT, handleLowStock);
        s.on(SOCKET_EVENTS.RECEIPT_READY, handleReceiptReady);
      }

      return () => {
        if (s) {
          s.off(SOCKET_EVENTS.NEW_ORDER, handleNewOrder);
          s.off(SOCKET_EVENTS.ORDER_REFUNDED, handleOrderRefunded);
          s.off(SOCKET_EVENTS.LOW_STOCK_ALERT, handleLowStock);
          s.off(SOCKET_EVENTS.RECEIPT_READY, handleReceiptReady);
        }
      };
    }
  }, [isAuthenticated, handleNewOrder, handleOrderRefunded, handleLowStock, handleReceiptReady]);

  return (
    <SocketContext.Provider value={{ socket, lastReceiptUrl, lastReceiptOrderId }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
"

"// ─── API Response Wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export type UserRole = 'superadmin' | 'admin' | 'manager' | 'cashier';

export interface User {
  _id: string;
  userId?: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  branchId?: string | Branch;
  isActive: boolean;
  isTwoFactorEnabled?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
  branchId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
"

"import {
    connectSocket,
    disconnectSocket,
    joinAdminRoom,
    joinBranchRoom,
    joinCashierRoom,
} from '@/lib/socket';
import type { AuthUser } from '@/types';
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: AuthUser, token: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token, refreshToken) => {
    Cookies.set('accessToken', token, { expires: 200 });
    Cookies.set('refreshToken', refreshToken, { expires: 200 });
    localStorage.setItem('user', JSON.stringify(user));

    set({ user, isAuthenticated: true, isLoading: false });

    // Connect socket and join rooms
    connectSocket();
    const role = user.role;
    if (role === 'superadmin' || role === 'admin') {
      joinAdminRoom();
    }
    if (role === 'manager') {
      joinAdminRoom();
      if (user.branchId) joinBranchRoom(user.branchId);
    }
    if (role === 'cashier') {
      joinCashierRoom(user.userId);
      if (user.branchId) joinBranchRoom(user.branchId);
    }
  },

  logout: () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    localStorage.removeItem('user');
    disconnectSocket();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  initializeAuth: () => {
    const token = Cookies.get('accessToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthUser;
        set({ user, isAuthenticated: true, isLoading: false });

        // Reconnect socket
        connectSocket();
        const role = user.role;
        if (role === 'superadmin' || role === 'admin') joinAdminRoom();
        if (role === 'manager') {
          joinAdminRoom();
          if (user.branchId) joinBranchRoom(user.branchId);
        }
        if (role === 'cashier') {
          joinCashierRoom(user.userId);
          if (user.branchId) joinBranchRoom(user.branchId);
        }
      } catch {
        get().logout();
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
"


"{
  "name": "sales-pilot-fe",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@hookform/resolvers": "^5.2.2",
    "@monaco-editor/react": "^4.6.0",
    "@mui/icons-material": "^7.3.7",
    "@mui/material": "^7.3.7",
    "@mui/x-data-grid": "^8.25.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.90.19",
    "@tanstack/react-query-devtools": "^5.91.3",
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "@types/js-cookie": "^3.0.6",
    "axios": "^1.13.4",
    "clsx": "^2.1.0",
    "date-fns": "^3.0.0",
    "framer-motion": "^11.0.0",
    "gsap": "^3.14.2",
    "js-cookie": "^3.0.5",
    "lucide-react": "^0.563.0",
    "next": "^16.1.6",
    "postcss": "^8.5.6",
    "react": "18.2.0",
    "react-beautiful-dnd": "^13.1.1",
    "react-dom": "18.2.0",
    "react-dropzone": "^14.2.3",
    "react-hook-form": "^7.49.0",
    "react-hot-toast": "^2.6.0",
    "react-markdown": "^10.1.0",
    "react-syntax-highlighter": "^16.1.0",
    "recharts": "^2.10.0",
    "socket.io-client": "^4.7.0",
    "tailwind-merge": "^2.6.0",
    "zod": "^3.22.4",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-beautiful-dnd": "^13.1.6",
    "@types/react-dom": "^19",
    "@types/react-syntax-highlighter": "^15.5.13",
    "eslint": "^9",
    "eslint-config-next": "16.1.4",
    "tailwindcss": "^4.2.0",
    "typescript": "^5"
  }
}
"

"'use client';

import { useLogin } from '@/hooks/use-auth';
import { Eye, EyeOff, LogIn, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const role = data.user.role;
          if (role === 'cashier') {
            router.push('/pos');
          } else {
            router.push('/dashboard');
          }
        },
      },
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to SalesPilot</h1>
        <p className="text-gray-500 mt-1">Sign in to your account</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {login.isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
"


"'use client';

import { useRegister } from '@/hooks/use-auth';
import { ShoppingBag, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form, { onSuccess: () => router.push('/login') });
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
          <ShoppingBag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-500 mt-1">Join SalesPilot today</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={register.isPending}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {register.isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
"


"'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
"


"'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'cashier') {
        router.push('/pos');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}
"


"import { QueryProvider } from '@/providers/query-provider';
import { SocketProvider } from '@/providers/socket-provider';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'SalesPilot — Smart POS System',
  description: 'Modern point-of-sale system with AI-powered insights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <SocketProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#ffffff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
              }}
            />
          </SocketProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
"


"'use client';

import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth-store';
import type {
    ApiResponse,
    AuthResponse,
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    User,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return res.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      toast.success(`Welcome back, ${data.user.fullName}!`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await api.post<ApiResponse<{ user: User }>>('/auth/register', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    },
  });
}

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<User>>('/auth/me');
      return res.data.data;
    },
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await api.patch<ApiResponse<User>>('/auth/me/update', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Profile updated');
    },
    onError: () => toast.error('Failed to update profile'),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      await api.patch('/auth/me/change-password', data);
    },
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Failed to change password');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post<ApiResponse<User>>('/auth/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      toast.success('Avatar updated');
    },
    onError: () => toast.error('Failed to upload avatar'),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSettled: () => {
      logout();
    },
  });
}
"


"'use client';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import {
    BarChart3,
    Brain,
    ChevronLeft,
    CreditCard,
    FileText,
    GitBranch,
    LayoutDashboard,
    Monitor,
    Package,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Tag,
    Ticket,
    Users,
    UsersRound,
    Warehouse
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['superadmin', 'admin', 'manager'] },
  { label: 'POS', href: '/pos', icon: Monitor, roles: ['cashier', 'admin', 'superadmin', 'manager'] },
  { label: 'Orders', href: '/orders', icon: ShoppingCart, roles: ['superadmin', 'admin', 'manager', 'cashier'] },
  { label: 'Products', href: '/products', icon: Package, roles: ['superadmin', 'admin', 'manager'] },
  { label: 'Categories', href: '/categories', icon: Tag, roles: ['superadmin', 'admin'] },
  { label: 'Inventory', href: '/inventory', icon: Warehouse, roles: ['superadmin', 'admin', 'manager'] },
  { label: 'Customers', href: '/customers', icon: UsersRound, roles: ['superadmin', 'admin', 'manager', 'cashier'] },
  { label: 'Coupons', href: '/coupons', icon: Ticket, roles: ['superadmin', 'admin'] },
  { label: 'Staff', href: '/staff', icon: Users, roles: ['superadmin', 'admin', 'manager'] },
  { label: 'Branches', href: '/branches', icon: GitBranch, roles: ['superadmin', 'admin'] },
  { label: 'Cash Register', href: '/cash-register', icon: CreditCard, roles: ['cashier', 'admin', 'superadmin'] },
  { label: 'Reports', href: '/reports', icon: FileText, roles: ['superadmin', 'admin'] },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['superadmin', 'admin'] },
  { label: 'AI Insights', href: '/ai-insights', icon: Brain, roles: ['superadmin', 'admin'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['superadmin', 'admin', 'manager', 'cashier'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const filteredNav = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-[260px]' : 'w-[72px]',
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {sidebarOpen && (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">SalesPilot</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                !sidebarOpen && 'justify-center px-0',
              )}
              title={!sidebarOpen ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-indigo-600')} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      {sidebarOpen && user && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
"


"'use client';

import { useLogout } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';
import { Bell, LogOut, Menu, Search, User } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const logout = useLogout();

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-lg border-b border-gray-200 flex items-center justify-between px-6 transition-all',
        sidebarOpen ? 'left-[260px]' : 'left-[72px]',
      )}
    >
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="h-8 w-px bg-gray-200" />

        <Link href="/settings" className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-indigo-600" />
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
          </div>
        </Link>

        <button
          onClick={() => logout.mutate()}
          className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
"
