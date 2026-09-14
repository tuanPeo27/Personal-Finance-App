import { useEffect, useState } from "react";
import { api, type Notification } from "../lib/api";

interface Props {
  toast: (msg: string, t?: "success" | "error" | "warning") => void;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function Notifications({ toast }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setNotifications(await api.notifications());
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không thể tải thông báo!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const markAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      await api.markNotificationRead(notification.id);
      setNotifications((items) => items.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item
      ));
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không thể cập nhật thông báo!", "error");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không thể cập nhật thông báo!", "error");
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.deleteNotification(id);
      setNotifications((items) => items.filter((item) => item.id !== id));
      toast("Đã xoá thông báo!", "warning");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Không thể xoá thông báo!", "error");
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20 lg:pb-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-900 text-2xl text-[#1e1b4b]">Thông báo</h2>
          <p className="text-sm text-[#6b7280]">
            {unreadCount ? `${unreadCount} thông báo chưa đọc` : "Bạn đã xem hết thông báo"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => void markAllAsRead()}
            className="text-sm font-700 text-[#7c6fcd] hover:underline"
          >
            Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-8 text-center text-sm text-[#6b7280] border border-[#e8e4f5]">
          Đang tải thông báo...
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#e8e4f5]">
          <div className="text-4xl mb-3">🔔</div>
          <p className="font-700 text-[#1e1b4b]">Chưa có thông báo</p>
          <p className="text-sm text-[#6b7280] mt-1">Các cập nhật mới sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => void markAsRead(notification)}
              className={`bg-white rounded-2xl p-4 border transition-colors cursor-pointer ${notification.isRead ? "border-[#e8e4f5]" : "border-[#c9c1f3] bg-[#faf8ff]"}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ede9fb] flex items-center justify-center text-lg flex-shrink-0">🔔</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-sm text-[#1e1b4b] ${notification.isRead ? "font-600" : "font-800"}`}>
                      {notification.title}
                    </h3>
                    <button
                      aria-label="Xoá thông báo"
                      onClick={(event) => {
                        event.stopPropagation();
                        void deleteNotification(notification.id);
                      }}
                      className="text-xs text-[#f87171] hover:underline flex-shrink-0"
                    >
                      Xoá
                    </button>
                  </div>
                  <p className="text-sm text-[#6b7280] mt-1">{notification.message}</p>
                  <p className="text-xs text-[#9ca3af] mt-2">{formatDate(notification.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
