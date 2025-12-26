import { useState, useEffect } from 'react'
import { getEthBalance } from "../utils/utils";

const WalletBalance = ({user, router, balance}: any) => {
    useEffect(() => {
      if (!user?.wallet) return;
  
    }, [user]);

    const pushToDetails = () => {
        router.push("/profile")
    }
  

  return (
    <div onClick={pushToDetails} className="fixed cursor-pointer bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
        <div className="w-2 h-2 rounded-full bg-[#b2fa63] animate-pulse"></div>
        <span className="text-xs font-bold text-zinc-400 font-mono tracking-tighter">Your balance:</span>
        <div className="h-4 w-px bg-zinc-800"></div>
        <span className="text-xs font-bold text-zinc-400 font-mono tracking-tighter uppercase">${Number(balance)} ETH</span>
    </div>
  )
}

export default WalletBalance