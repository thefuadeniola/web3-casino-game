"use client"
import { usePrivy } from "@privy-io/react-auth";

function LogoutButton({ router }: any) {
  const { logout } = usePrivy();

  const handleLogout = async () => {
    await logout();
    router.push('/')
  }

  return (
    <button className="h-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full px-6 py-3 text-zinc-400 cursor-pointer" onClick={handleLogout}>
      Log out
    </button>
  );
}

export default LogoutButton