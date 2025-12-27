"use client";

import { useEffect, useState } from "react";
import { usePrivy, useCreateWallet } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { truncateAddress, getEthBalance } from "../utils/utils";

import deposit from "@/app/static/images/deposit.svg";
import incoming from "@/app/static/images/deposit_icon.svg";
import winning from "@/app/static/images/win_icon.svg";
import debit from "@/app/static/images/withdraw_icon.svg";

import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";

const WalletDetails = () => {
  const router = useRouter();
  const { user, ready, authenticated } = usePrivy();
  const { createWallet } = useCreateWallet();

  const [balance, setBalance] = useState<string>("0");
  const [copied, setCopied] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [walletCreating, setWalletCreating] = useState(false);

  /* ------------------ Auth / Wallet Init ------------------ */
  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      router.replace("/");
      return;
    }

    if (!user?.wallet && !walletCreating) {
      setWalletCreating(true);
      createWallet().finally(() => setWalletCreating(false));
    }
  }, [ready, authenticated, user, walletCreating, createWallet, router]);

  /* ------------------ Balance Fetch ------------------ */
  useEffect(() => {
    if (!user?.wallet?.address) return;

    getEthBalance(user.wallet.address)
      .then((bal) => setBalance(bal ?? "0"))
      .catch(() => setBalance("0"));
  }, [user?.wallet?.address]);

  /* ------------------ Clipboard ------------------ */
  const handleCopy = async (text?: string) => {
    if (!text || typeof window === "undefined") return;
    if (!navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (!ready) {
    return <div className="text-white">Loading…</div>;
  }

  const displayBalance =
    balance && !isNaN(Number(balance))
      ? Number(balance).toFixed(4)
      : "0.0000";

  const walletAddress = user?.wallet?.address;

  return (
    <div className="pt-6">
      {/* ------------------ Header ------------------ */}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
          <div className="font-black text-gray-600">0x</div>
        </div>

        <p className="text-white text-[22px] font-black mt-2.5">
          {displayBalance} ETH
        </p>

        {walletAddress && (
          <p className="text-[14px] text-[#B2FA63]">
            {truncateAddress(walletAddress)} |{" "}
            <button
              onClick={() => handleCopy(walletAddress)}
              className="text-white underline"
            >
              {copied ? "copied!" : "copy"}
            </button>
          </p>
        )}
      </div>

      {/* ------------------ Wallet Info ------------------ */}
      <div className="flex flex-col lg:flex-row mt-10">
        <div className="lg:flex-1 rounded-lg px-4 py-5 bg-[#28282A] space-y-3.5">
          <Row label="Email" value={user?.email?.address} />
          <Row label="Address" value={truncateAddress(walletAddress)} />
          <Row label="Native currency" value="Sepolia ETH" />

          <div className="flex gap-3.5 pt-2">
            <button
              onClick={() => setDepositModal(true)}
              className="h-10 flex-1 bg-[#B2FA63] text-white rounded-lg flex items-center justify-center"
            >
              <Image src={deposit} alt="deposit" height={14} width={10} className="mr-2" />
              Deposit
            </button>

            <button
              onClick={() => setWithdrawModal(true)}
              className="h-10 flex-1 bg-[#535353] text-white rounded-lg flex items-center justify-center"
            >
              <Image
                src={deposit}
                alt="withdraw"
                height={14}
                width={10}
                className="mr-2 rotate-180"
              />
              Withdraw
            </button>
          </div>
        </div>

        {/* ------------------ Transactions (Static) ------------------ */}
        <div className="lg:flex-1 lg:ml-6 mt-6 lg:mt-0">
          <h1 className="font-black text-white">Transactions</h1>
          <div className="rounded-lg mt-2.5 bg-[#28282A]">
            <TxRow icon={debit} title="Debit" sub="coin flip" value="- $30.00" color="text-red-500" />
            <TxRow icon={debit} title="Debit" sub="dice roll" value="- $30.00" color="text-red-500" />
            <TxRow icon={winning} title="Winning" sub="dice roll" value="+ $30.00" color="text-[#B2FA63]" />
            <TxRow icon={incoming} title="Deposit" sub="external deposit" value="+ $30.00" color="text-[#B2FA63]" />
          </div>
        </div>
      </div>

      {/* ------------------ Modals ------------------ */}
      {depositModal && walletAddress && (
        <DepositModal
          setDepositModal={setDepositModal}
          walletAddress={walletAddress}
          handleCopy={handleCopy}
        />
      )}

      {withdrawModal && walletAddress && (
        <WithdrawModal
          setWithdrawModal={setWithdrawModal}
          walletAddress={walletAddress}
        />
      )}
    </div>
  );
};

/* ------------------ Small Components ------------------ */
const Row = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex justify-between text-white text-sm">
    <span>{label}</span>
    <span>{value ?? "-"}</span>
  </div>
);

const TxRow = ({
  icon,
  title,
  sub,
  value,
  color,
}: {
  icon: any;
  title: string;
  sub: string;
  value: string;
  color: string;
}) => (
  <div className="flex justify-between items-center px-3 py-4 border-b border-zinc-700 last:border-none">
    <div className="flex items-center gap-2.5">
      <Image src={icon} alt={title} />
      <div>
        <h1 className="text-white font-bold text-sm">{title}</h1>
        <p className={`${color} text-xs`}>{sub}</p>
      </div>
    </div>
    <span className="text-white font-black">{value}</span>
  </div>
);

export default WalletDetails;
