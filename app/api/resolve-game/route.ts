// /app/api/resolve-game/route.ts
import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import CasinoABI from "@/lib/contracts/Casino.json"

const CASINO_ADDRESS = "0x22549FCF51355E83f9806C16a41A56A532358D87";
const HOUSE_EDGE = 0.05;

const account = privateKeyToAccount(`0x${process.env.CASINO_OWNER_KEY}`);

const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(process.env.RPC_URL),
});

export async function POST(req: Request) {
  const { player, context, prediction, stake } = await req.json();

  // 1️⃣ SERVER-SIDE RNG
  let rolledValue;
  let isWin;
  let multiplier;

  if (context == "Coin Flip") {
    rolledValue = randomInt(1, 3); // 1 or 2
    isWin = rolledValue == prediction;
    multiplier = 2 * (1 - HOUSE_EDGE); // 1.9
  } else {
    rolledValue = randomInt(1, 7); // 1–6
    isWin = rolledValue == prediction;
    multiplier = 6 * (1 - HOUSE_EDGE); // 5.7
  }

  console.log(context, rolledValue, prediction)

  if (isWin == false) {
    return NextResponse.json({
      value: rolledValue,
      isWin,
      multiplier: 0,
    });

  } else {
    const payout = parseEther((Number(stake) * multiplier).toFixed(18))

    // 2️⃣ CALL CONTRACT
    await client.writeContract({
      address: CASINO_ADDRESS,
      abi: CasinoABI,
      functionName: "resolve",
      args: [player, isWin, payout],
    });

    // 3️⃣ RETURN RESULT TO CLIENT
    return NextResponse.json({
      value: rolledValue,
      isWin,
      multiplier,
    });

  }
}
