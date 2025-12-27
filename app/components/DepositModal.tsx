"use client"
import { Button } from "@/components/ui/button"
import { X, Copy } from "lucide-react"

const DepositModal = ({setDepositModal, walletAddress, handleCopy}: any) => {
  return (
    <div className="h-screen fixed top-0 right-0 left-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border rounded-xl shadow-lg max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Deposit Funds</h2>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setDepositModal(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm">Copy this wallet address & fund with ETH on Sepolia ETH</p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <code className="text-xs break-all flex-1 font-mono">{walletAddress}</code>
              <Button variant="secondary" size="icon" className="h-8 w-8 shrink-0" onClick={handleCopy}>
                <Copy className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Note: Only send Sepolia ETH to this address. Sending funds on other networks may result in permanent loss.
            </p>
          </div>

          <Button className="w-full text-white" onClick={() => setDepositModal(false)}>
            I've sent the funds
          </Button>
        </div>
      </div>
    </div>  
  )
}

export default DepositModal