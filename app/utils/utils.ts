import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

export function truncateAddress(address: string | undefined ) {
    if(!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
};

const client = createPublicClient({
  chain: sepolia,
  transport: http(`https://rpc.ankr.com/eth_sepolia/${process.env.NEXT_PUBLIC_ANKR_KEY}`),
});

export async function getEthBalance(address: any) {
  const balance = await client.getBalance({ address });
  return formatEther(balance);
}