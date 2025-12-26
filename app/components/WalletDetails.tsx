"use client"
import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth"
import { useCreateWallet } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { truncateAddress } from "../utils/utils";
import { getEthBalance } from "../utils/utils";
import deposit from "@/app/static/images/deposit.svg"
import Image from "next/image";
import incoming from "@/app/static/images/deposit_icon.svg"
import winning from "@/app/static/images/win_icon.svg"
import debit from "@/app/static/images/withdraw_icon.svg"
import DepositModal from "./DepositModal";

const WalletDetails = () => {
  const router = useRouter();
  const { user, ready, authenticated } = usePrivy();
  const { createWallet } = useCreateWallet()
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState("")
  const [depositModal, setDepositModal] = useState(false)

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      // user is not logged in → redirect
      router.push("/"); // send to homepage / login page
      return;
    }

    if (!user?.wallet) {
      createWallet(); 
    }

  }, [ready, authenticated, user, createWallet]);

  useEffect(() => {
    if (!user?.wallet) return;

    getEthBalance(user?.wallet?.address).then(setBalance);
  }, [user]);

  if (!ready) return <div>Loading…</div>;

  const handleCopy = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  }

  return (
    <div className="pt-6">
      <div className="w-full flex flex-col items-center justify-center">
        <div className="h-20 w-20 bg-white rounded-[50%] flex items-center justify-center">
          <div className="font-black text-gray-600">0x</div>
        </div>
        <p className="text-white text-[22px] font-black mt-2.5">${Number(balance).toFixed(2)} ETH</p>
        <p className="font-regular text-[14px] text-[#B2FA63]">{truncateAddress(user?.wallet?.address)} |         <button onClick={() => handleCopy(user?.wallet?.address)} className="font-regular text-white text-[14px] underline cursor-pointer">{copied ? 'copied!' : 'copy'}</button></p>
      </div>
      <div className="flex flex-col lg:flex-row mt-10">
        <div className="lg:flex-1 h-fit rounded-lg px-4 py-5 flex flex-col gap-3.5 w-full bg-[#28282A]">
          <div className="flex flex-row-items-center justify-between text-white">
            <span>Email</span>
            <span>{user?.email?.address}</span>
          </div>
          <div className="flex flex-row-items-center justify-between text-white">
            <span>Address</span>
            <span>{truncateAddress(user?.wallet?.address)}</span>
          </div>
          <div className="flex flex-row-items-center justify-between text-white">
            <span>Native currency</span>
            <span>Sepolia ETH</span>
          </div>
          <div className="flex flex-row-items-center gap-3.5">
            <button onClick={()=>setDepositModal(true)} className="h-10 flex-1 bg-[#B2FA63] flex flex-row justify-center items-center text-white rounded-lg">
              <Image src={deposit} alt="deposit" height={14} width={10} className="mr-2" />
              Deposit
            </button>
            <button className="h-10 flex-1 bg-[#535353] flex flex-row justify-center items-center text-white rounded-lg">
              <Image src={deposit} alt="deposit" height={14} width={10} className="mr-2 rotate-180" />
              Withdraw
            </button>
          </div>
        </div>

        <div className="ml-0 lg:ml-6 mt-6 lg:mt-0 lg:flex-1">
          <h1 className="font-black text-white">Transactions</h1>
          <div className="rounded-lg mt-2.5 bg-[#28282A] flex flex-col w-full">
            <div className="flex flex-row justify-between items-center px-3 py-4">
              <div className="flex flex-row items-center gap-2.5">
                <Image src={debit} alt="incoming" />
                <div className="">
                  <h1 className="text-white font-bold text-[14px]">Debit</h1>
                  <p className="text-[#c20000] text-[12px]">coin flip</p>
                </div>
              </div>

              <span className="text-white font-black text-14px">- $30.00</span>
            </div>

            <div className="flex flex-row justify-between items-center px-3 py-4">
              <div className="flex flex-row items-center gap-2.5">
                <Image src={debit} alt="debit" />
                <div className="">
                  <h1 className="text-white font-bold text-[14px]">Debit</h1>
                  <p className="text-[#c20000] text-[12px]">dice roll</p>
                </div>
              </div>

              <span className="text-white font-black text-14px">- $30.00</span>
            </div>
            <div className="flex flex-row justify-between items-center px-3 py-4">
              <div className="flex flex-row items-center gap-2.5">
                <Image src={winning} alt="incoming" />
                <div className="">
                  <h1 className="text-white font-bold text-[14px]">Winning</h1>
                  <p className="text-[#B2FA63] text-[12px]">dice roll</p>
                </div>
              </div>

              <span className="text-white font-black text-14px">+ $30.00</span>
            </div>
            <div className="flex flex-row justify-between items-center px-3 py-4">
              <div className="flex flex-row items-center gap-2.5">
                <Image src={incoming} alt="incoming" />
                <div className="">
                  <h1 className="text-white font-bold text-[14px]">Deposit</h1>
                  <p className="text-[#B2FA63] text-[12px]">external deposit</p>
                </div>
              </div>

              <span className="text-white font-black text-14px">+ $30.00</span>
            </div>

          </div>
        </div>
      </div>
      {depositModal && <DepositModal setDepositModal={setDepositModal} walletAddress={user?.wallet?.address} handleCopy={handleCopy} />}
    </div>
  )
}

export default WalletDetails