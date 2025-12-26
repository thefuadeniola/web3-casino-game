import Link from 'next/link'
import WalletDetails from '@/app/components/WalletDetails'

const page = () => {
  return (
    <main>
        <nav className="pt-7.5 pb-5.5 flex items-center justify-center border-b-2 border-[#646464] relative">
            <h2 className='font-bold text-[16px] text-[#B2FA63]'>Your Wallet</h2>
            <Link href="/play/dice" className='absolute top-7.5 right-5.5 font-regular text-[16px] text-white underline'>Play Now</Link>
        </nav>
        <section className="px-5">
            <WalletDetails />
        </section>
    </main>
  )
}

export default page