import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string; // o Date si lo manejas como objeto Date
    read?: boolean;
}

// NotificationContext.tsx
type WebSocketContextType = {
    socket: WebSocket | null;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

const WebSocketContext = createContext<WebSocketContextType>({
    socket: null,
    notifications: [],
    setNotifications: () => { },
});

export const useWebSocket = () => useContext(WebSocketContext);

export function useDeleteNotification() {
    const { socket } = useWebSocket();

    return (id_notification: number) => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        console.log("hola")
        const { id_user } = user;

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "delete_notification",
                id_notification,
                user_id: id_user
            }));
        } else {
            console.warn("WebSocket no conectado");
        }
    };
}

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const socketRef = useRef<WebSocket | null>(null);
    const DOMAIN = import.meta.env.VITE_DOMAIN_NOTIFICATIONS;

    const [user, setUser] = useState<{ id_user?: number }>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.id_user !== user.id_user) {
                    setUser(parsedUser);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [user]);

    useEffect(() => {
        if (!user.id_user || socketRef.current) return;

        const ws = new WebSocket(DOMAIN);

        ws.onopen = () => {
            console.log("WebSocket conectado");
            ws.send(JSON.stringify({
                type: "register",
                user_id: user.id_user
            }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "history") {
                setNotifications(data.notifications);
            }

            if (data.type === "new_notification") {
                setNotifications((prev) => [data.notification, ...prev]);
            }
        };

        ws.onerror = (e) => console.error("Error en WebSocket:", e);
        ws.onclose = () => console.log("WebSocket cerrado");

        socketRef.current = ws;
        setSocket(ws);

        return () => {
            ws.close();
            socketRef.current = null;
            setSocket(null);
        };
    }, [user]);

    return (
        <WebSocketContext.Provider value={{ socket, notifications, setNotifications }}>
            {children}
        </WebSocketContext.Provider>
    );
};
