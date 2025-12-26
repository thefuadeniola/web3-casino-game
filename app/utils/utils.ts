import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

export function truncateAddress(address: string | undefined) {
    if(!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
};

const client = createPublicClient({
  chain: sepolia,
  transport: http("https://rpc.ankr.com/eth_sepolia/2b4feffe59e279939070e199476e86e0d44b8d0bb31d625bc2d81d2de9a947a7"),
});

export async function getEthBalance(address: any) {
  const balance = await client.getBalance({ address });
  return formatEther(balance);
}