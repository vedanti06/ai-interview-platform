"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    toast.success("Logged out successfully.");
    router.push("/sign-in");
  }

  return (
    <button onClick={handleLogout} className="btn btn-secondary ml-4">
      Logout
    </button>
  );
}
