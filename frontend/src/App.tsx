import { useState } from "react";
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

export default function App() {
  const [page, setPage] = useState<Page>("login");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (message: string, type: ToastType["type"] = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const isAuth = page !== "login" && page !== "register";

  return (
    <div className="min-h-screen bg-[#faf8ff]">
      {!isAuth ? (
        <>
          {page === "login" && <Login goTo={setPage} toast={addToast} />}
          {page === "register" && <Register goTo={setPage} toast={addToast} />}
        </>
      ) : (
        <div className="flex min-h-screen">
          <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
            <TopBar page={page} setSidebarOpen={setSidebarOpen} setPage={setPage} />
            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {page === "dashboard" && <Dashboard setPage={setPage} toast={addToast} />}
              {page === "accounts" && <Accounts toast={addToast} />}
              {page === "transactions" && <Transactions toast={addToast} />}
              {page === "categories" && <Categories toast={addToast} />}
              {page === "budgets" && <Budgets toast={addToast} />}
              {page === "goals" && <Goals toast={addToast} />}
              {page === "profile" && <Profile toast={addToast} setPage={setPage} />}
              {page === "notifications" && <Notifications toast={addToast} />}
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
