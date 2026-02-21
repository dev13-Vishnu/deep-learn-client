import { createContext } from "react";

export type NotifyType = 'success' | 'error' | 'info' | 'warning';

export type NotifyFn = (message: string, type?: NotifyType) => void;

export const NotificationContext = createContext<NotifyFn>(() => {});