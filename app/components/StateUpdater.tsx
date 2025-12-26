import spinner from "@/app/static/images/spinning-circle.gif"
import Image from 'next/image'

const StateUpdater = ({message}: any) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white backdrop-blur-md border border-zinc-800 rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
        <Image src={spinner} alt="loading..." height={24} width={24} unoptimized />
        <span className="text-xs font-bold text-black font-mono tracking-tighter uppercase">{message}</span>
    </div>
  )
}

export default StateUpdater