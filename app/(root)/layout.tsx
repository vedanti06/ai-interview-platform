import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepInterview</h2>
        </Link>
        <div>{user && <LogoutButton />}</div>
      </nav>

      {children}
    </div>
  );
};

export default Layout;