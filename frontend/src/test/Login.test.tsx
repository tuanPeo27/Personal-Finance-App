import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../pages/Login";
import { api } from "../lib/api";

vi.mock("../lib/api", () => ({
  api: {
    login: vi.fn(),
  },
}));

describe("Login form", () => {
  const goTo = vi.fn();
  const toast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores the returned session and navigates to dashboard", async () => {
    vi.mocked(api.login).mockResolvedValue({
      token: "jwt-token",
      expiresAt: "2026-10-24T00:00:00Z",
      userId: 7,
      fullName: "Test User",
      email: "test@example.test",
    });
    render(<Login goTo={goTo} toast={toast} />);

    fireEvent.change(screen.getByPlaceholderText("email@example.com"), {
      target: { value: "test@example.test" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "Passw0rd!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => expect(goTo).toHaveBeenCalledWith("dashboard"));
    expect(api.login).toHaveBeenCalledWith("test@example.test", "Passw0rd!");
    expect(localStorage.getItem("finance_token")).toBe("jwt-token");
    expect(JSON.parse(localStorage.getItem("finance_user") ?? "{}")).toEqual({
      id: 7,
      fullName: "Test User",
      email: "test@example.test",
    });
  });

  it("reports a failed login without navigating", async () => {
    vi.mocked(api.login).mockRejectedValue(new Error("Invalid email or password."));
    render(<Login goTo={goTo} toast={toast} />);

    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Invalid email or password.", "error");
    });
    expect(goTo).not.toHaveBeenCalled();
    expect(localStorage.getItem("finance_token")).toBeNull();
  });
});
