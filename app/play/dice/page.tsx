"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GameContext, RollResult } from '@/app/types'
import Dice from '@/app/components/Dice'
import Coin from '@/app/components/Coin'
import LogoutButton from '@/app/components/LogoutBtn';
import { useRouter } from "next/navigation";
import WalletBalance from '@/app/components/WalletBalance';
import { usePrivy, useSendTransaction } from '@privy-io/react-auth';
import { getEthBalance, truncateAddress } from '@/app/utils/utils';
import { parseEther } from 'viem';
import StateUpdater from '@/app/components/StateUpdater';
import dynamic from "next/dynamic"

const Confetti = dynamic(() => import('@/app/components/Confetti'), {
  ssr: false,
});

const App: React.FC = () => {
  const router = useRouter()  
  const { ready, authenticated, user } = usePrivy()
  const { sendTransaction } = useSendTransaction()

  const [balance, setBalance] = useState("") 

    useEffect(() => {
        if (!ready) return;

        if (!authenticated) {
        // user is not logged in → redirect
        router.push("/"); // send to homepage / login page
        return;
        }

        if (!user?.wallet) {
            router.push('/profile'); 
        } else {
            getEthBalance(user?.wallet?.address).then(setBalance);
        }

    }, [ready, authenticated, user]);
  

  const [context, setContext] = useState<GameContext>(GameContext.DICE);
  const [currentValue, setCurrentValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [history, setHistory] = useState<RollResult[]>([]);
  const [stake, setStake] = useState<string>("0.002");
  const [prediction, setPrediction] = useState<number>(1); // users prediction held here
  const [message, setMessage] = useState("Sending stake...")
  const [confetti, setConfetti] = useState(false)

  const contexts = useMemo(() => Object.values(GameContext), []);

    const handleRoll = useCallback(async () => {
        if (balance <= stake) {
            alert("Not enough funds to place this bet, fund your wallet.")
            return;
        }

        if (isRolling) return;

        const confirmed = window.confirm(
            `Confirm to stake ${stake} eth on ${context}: ${prediction}?`
        );
        if (!confirmed) return;
        
        try {
            setIsRolling(true);
            const txHash = await sendTransaction(
                {
                    to: process.env.NEXT_PUBLIC_CASINO_ADDRESS,
                    value: parseEther(stake.toString())
                },
                {
                    address: user?.wallet?.address
                }
            )

            setMessage(`Stake sent, resolving game...`)

            const res = await fetch("/api/resolve-game", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player: user?.wallet?.address,
                    context,
                    prediction,
                    stake,
                }),
            });

            const { value, isWin, multiplier } = await res.json();
            setCurrentValue(value)

            setMessage(`Game resolved, calculating winnings...`)

            setTimeout(() => {
                const newResult = {
                    id: typeof window !== "undefined" ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
                    value,
                    prediction,
                    stake,
                    context,
                    timestamp: Date.now(),
                    isWin,
                };

                setHistory(prev => [newResult, ...prev.slice(0, 9)]);
                setIsRolling(false);

                // 4️⃣ Notify user
                if (isWin == true) {
                    setConfetti(true); // start confetti
                    // stop confetti after 3 seconds
                    setTimeout(() => setConfetti(false), 4000);                    
                    getEthBalance(user?.wallet?.address).then(setBalance);
                    setTimeout(() => {
                        alert(`🎉 You won ${Number(stake) * multiplier} ETH!`);
                    }, 4000);
                } else {
                    getEthBalance(user?.wallet?.address).then(setBalance);
                    alert(`❌ You lost`);
                }
            }, 3000);

        } catch (error) {
            console.error(error);
            setIsRolling(false);
            alert("Transaction failed or rejected");
        }
        
        
    }, [isRolling, context, prediction, stake]); // we can handle web3 payout/swallow here

  // Update default prediction when switching context
  const handleContextChange = (newCtx: GameContext) => {
    setContext(newCtx);
    setPrediction(1);
  };

    if (!ready) return <div>Loading…</div>;


  return (
    <div className="w-full mx-auto px-4 py-10 flex flex-col items-center min-h-screen font-sans">
      {/* Header */}
      <header className="w-full pb-6 mb-6 px-8 flex flex-row items-center justify-between">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-[#b2fa63] to-[#88e040] tracking-tighter">
          Play Flipper.
        </h1>
        <LogoutButton router={router} />
      </header>

      <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 w-full items-start">
        {/* Left Column: Sidebar Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Game Selection */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xs font-bold mb-4 flex items-center gap-2 text-zinc-500 uppercase tracking-widest">
              Choose Mode
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {contexts.map((ctx) => (
                <button
                  key={ctx}
                  onClick={() => handleContextChange(ctx)}
                  disabled={isRolling}
                  className={`w-full py-4 px-5 rounded-xl text-left transition-all flex items-center justify-between border-2 ${
                    context === ctx 
                      ? 'border-[#b2fa63] bg-[#b2fa63]/10 text-[#b2fa63] shadow-[0_0_15px_rgba(178,250,99,0.1)]' 
                      : 'border-zinc-800 bg-zinc-800/50 text-zinc-500 hover:border-zinc-700'
                  } ${isRolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="font-bold">{ctx}</span>
                  {context === ctx && <i className="fas fa-check-circle"></i>}
                </button>
              ))}
            </div>
          </div>

          {/* Betting Controls */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-xs font-bold mb-3 flex items-center gap-2 text-zinc-500 uppercase tracking-widest">
                Set Stake (Sepolia ETH)
              </h2>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.001"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  disabled={isRolling}
                  className="w-full bg-black border-2 border-zinc-800 rounded-xl py-4 px-5 text-xl font-bold text-white focus:border-[#b2fa63] outline-none transition-all disabled:opacity-50"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">ETH</span>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold mb-3 flex items-center gap-2 text-zinc-500 uppercase tracking-widest">
                Your Prediction
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {context === GameContext.DICE ? (
                  [1, 2, 3, 4, 5, 6].map(val => (
                    <button
                      key={val}
                      onClick={() => setPrediction(val)}
                      disabled={isRolling}
                      className={`py-3 rounded-lg font-bold border-2 transition-all ${
                        prediction === val 
                          ? 'border-[#b2fa63] bg-[#b2fa63] text-black shadow-lg shadow-[#b2fa63]/20' 
                          : 'border-zinc-800 bg-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))
                ) : (
                  [1, 2].map(val => (
                    <button
                      key={val}
                      onClick={() => setPrediction(val)}
                      disabled={isRolling}
                      className={`col-span-1.5 py-4 rounded-lg font-bold border-2 transition-all flex-1 ${
                        prediction === val 
                          ? 'border-[#b2fa63] bg-[#b2fa63] text-black shadow-lg shadow-[#b2fa63]/20' 
                          : 'border-zinc-800 bg-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {val === 1 ? 'HEADS' : 'TAILS'}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: Game Stage (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-16 shadow-2xl relative overflow-hidden flex flex-col items-center">
            {/* Ambient Background Blur */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#b2fa63]/5 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 blur-[100px] rounded-full"></div>

            {context === GameContext.DICE ? (
              <Dice value={currentValue} isRolling={isRolling} />
            ) : (
              <Coin value={currentValue} isFlipping={isRolling} />
            )}

            <button
              onClick={handleRoll}
              disabled={isRolling}
              className={`w-full max-w-sm mt-10 py-5 px-12 rounded-2xl font-black text-2xl transition-all tracking-tight shadow-[0_10px_40px_-10px_rgba(178,250,99,0.3)] ${
                isRolling 
                  ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed scale-95 shadow-none' 
                  : 'bg-[#b2fa63] hover:bg-[#c4ff80] text-black hover:-translate-y-1 active:scale-95'
              }`}
            >
              {isRolling ? "TRANSACTION PENDING..." : "PLAY ROUND"}
            </button>
          </div>

          {/* Results Feed */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xs font-bold mb-4 text-zinc-500 uppercase tracking-widest flex justify-between items-center">
              <span>Recent Activity</span>
              <span className="text-[10px] text-zinc-700">Displaying last 10 rounds</span>
            </h2>
            <div className="space-y-2 overflow-y-auto max-h-62.5 pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-20 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-700 font-bold italic">
                  No activity found on chain.
                </div>
              ) : (
                history.map((item: any) => (
                  <div key={item.id} className="bg-black/40 p-4 rounded-xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${item.isWin ? 'bg-[#b2fa63] text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                        {item.context === GameContext.DICE ? item.value : (item.value === 1 ? 'H' : 'T')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {item.context === GameContext.DICE ? 'DICE ROLL' : 'COIN FLIP'}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${item.isWin ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {item.isWin ? 'WIN' : 'LOSS'}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono">STAKE: {item.stake} ETH • PREDICTED: {item.context === GameContext.DICE ? item.prediction : (item.prediction === 1 ? 'HEADS' : 'TAILS')}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-700 font-mono">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Bar */}
      <WalletBalance user={user} router={router} balance={balance} />
      {isRolling && <StateUpdater message={message} />}
        {confetti && <Confetti />}
    </div>
  );
};

export default App;
