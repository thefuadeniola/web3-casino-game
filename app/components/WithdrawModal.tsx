import React, {useState} from 'react'
import { Button } from '@/components/ui/button'
import { X } from "lucide-react"
import { useSendTransaction } from '@privy-io/react-auth'
import { parseEther } from 'viem'

const WithdrawModal = ({ setWithdrawModal, walletAddress }: any) => {
    const { sendTransaction } = useSendTransaction()
    const [address, setAddress] = useState("")
    const [buttonText, setButtonText] = useState("Withdraw")
    const [isDisabled, setIsDisabled] = useState(false)
    const [withdrawalAmt, setWithdrawalAmt] = useState("0")

    const handleWithdraw = async () => {
        setIsDisabled(true)
        if(!address) {
            setIsDisabled(false)
            return
        }
        try {
            const txHash = await sendTransaction(
                { to: address, value: parseEther(withdrawalAmt.toString()) },
                { address: walletAddress }
            )

            setButtonText("Withdrawal Sent!")
        } catch (error) {
            setButtonText("Failed to withdraw, try again!")
            return;
        }
    }

  return (
    <div className="h-screen fixed top-0 right-0 left-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border rounded-xl shadow-lg max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Withdraw Funds</h2>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setWithdrawModal(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm">Enter address to withdraw to</p>
            <div className="flex items-center p-3 bg-muted rounded-lg border">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-transparent outline-0 foucs:outline-0" placeholder='e.g 0x...'/>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm">Enter withdrawal amount</p>
            <div className="flex items-center p-3 bg-muted rounded-lg border justify-between">
                <input type="text" value={withdrawalAmt} onChange={(e) => setWithdrawalAmt(e.target.value)} className="w-full bg-transparent outline-0 foucs:outline-0" />
                <span className='text-muted-foreground'>ETH</span>
            </div>
          </div>


          <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              Note: Sepolia eth address only.
            </p>
          </div>

          <Button disabled={isDisabled} className="w-full text-white" onClick={handleWithdraw}>
            {buttonText}
          </Button>
        </div>
      </div>
    </div>  
  )
}

export default WithdrawModal