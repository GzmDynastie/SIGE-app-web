import { useState, useEffect } from "react";
import Alert from "../Alert";
import { useWebSocket } from "../../context/NotificationContext";

interface Notification {
  title: string;
  message: string;
}

const Notifications = () => {
  const { socket } = useWebSocket();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [history, setHistory] = useState<Notification[]>([]);
  console.log(history)

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setHistory(data.notifications);
      }

      if (data.type === "new_notification") {
        setNotification(data.notification);
        setHistory((prev) => [data.notification, ...prev]);

        setTimeout(() => setNotification(null), 5000);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket]);

  return (
    <>
      {notification && (
        <Alert
          text={`${notification.title}\n${notification.message}`}
          variant="alert alert-primary"
          iconVariant="information"
        />
      )}
    </>
  );
};

export default Notifications;