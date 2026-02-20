import { useContext } from "react";
import { NotificationContext, type NotifyFn } from "./notification.context";

export function useNotify(): NotifyFn{
    return useContext(NotificationContext);
}