import { useCallback, useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Toast from "./components/Toast";
import { API_URL, api, type Notification } from "./lib/api";

export type Page =
  | "login"
  | "register"
  | "dashboard"
  | "accounts"
  | "transactions"
  | "categories"
  | "budgets"
  | "goals"
  | "profile"
  | "notifications";

export type ToastType = { id: number; message: string; type: "success" | "error" | "warning" };

const pagePaths: Record<Page, string> = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  accounts: "/accounts",
  transactions: "/transactions",
  categories: "/categories",
  budgets: "/budgets",
  goals: "/goals",
  profile: "/profile",
  notifications: "/notifications",
};

const pathPages = Object.entries(pagePaths).reduce<Record<string, Page>>((pages, [page, path]) => {
  pages[path] = page as Page;
  return pages;
}, {});

const getInitialPage = (): Page => {
  const pathPage = pathPages[window.location.pathname];
  return pathPage && (pathPage === "login" || pathPage === "register" || localStorage.getItem("finance_token"))
    ? pathPage
    : "login";
};

export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const isAuth = page !== "login" && page !== "register";

  const addToast = useCallback((message: string, type: ToastType["type"] = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    const handlePopState = () => setPage(getInitialPage());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isAuth) {
      setNotifications([]);
      return;
    }

    let active = true;
    const token = localStorage.getItem("finance_token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1] || ""));
      if (!payload || typeof payload.exp !== "number" || Date.now() >= payload.exp * 1000) {
        return;
      }
    } catch {
      return;
    }

    void api.notifications().then((items) => {
      if (active) {
        setNotifications((current) => [
          ...items,
          ...current.filter((item) => !items.some((loaded) => loaded.id === item.id)),
        ]);
      }
    }).catch(() => undefined);

    const hubUrl = `${API_URL.replace(/\/api\/?$/, "")}/hubs/notifications`;
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("finance_token") ?? "",
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on("NotificationCreated", (notification: Notification) => {
      if (!active) return;
      setNotifications((items) => items.some((item) => item.id === notification.id)
        ? items
        : [notification, ...items]);
      addToast(notification.message, "success");
    });

    connection.onclose(() => {
      if (active) {
        setNotifications((items) => items);
      }
    });

    void connection.start().catch(() => undefined);

    return () => {
      active = false;
      connection.off("NotificationCreated");
      void connection.stop();
    };
  }, [isAuth, addToast]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    const nextPath = pagePaths[nextPage];
    if (window.location.pathname !== nextPath) window.history.pushState({}, "", nextPath);
  };

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {!isAuth ? (
        <>
          {page === "login" && <Login goTo={navigate} toast={addToast} />}
          {page === "register" && <Register goTo={navigate} toast={addToast} />}
        </>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar page={page} setPage={navigate} open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
            <TopBar page={page} setSidebarOpen={setSidebarOpen} setPage={navigate} unreadCount={notifications.filter((item) => !item.isRead).length} />
            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {page === "dashboard" && <Dashboard setPage={navigate} toast={addToast} />}
              {page === "accounts" && <Accounts toast={addToast} />}
              {page === "transactions" && <Transactions toast={addToast} />}
              {page === "categories" && <Categories toast={addToast} />}
              {page === "budgets" && <Budgets toast={addToast} />}
              {page === "goals" && <Goals toast={addToast} />}
              {page === "profile" && <Profile toast={addToast} setPage={navigate} />}
              {page === "notifications" && <Notifications toast={addToast} notifications={notifications} setNotifications={setNotifications} />}
            </main>
          </div>
        </div>
      )}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
}
