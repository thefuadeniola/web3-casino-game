import React from 'react'
import Image from 'next/image'
import logo2 from "@/app/static/images/logo2.png"
import background from "@/app/static/images/bg-img.svg"
import question from "@/app/static/images/info.svg"
import arrow from "@/app/static/images/arrow.svg"
import Signin from '../components/Signin'
import footer from "@/app/static/images/bottom-bg.svg"

const page = () => {

  return (
    <main className="w-full flex flex-col lg:flex-row lg:p-10 p-0">
      <div className="hidden lg:block pt-10.5 pb-7.5 lg:bg-black lg:rounded-2xl">
        <nav className="w-full flex justify-center items-center">
          <div className="flex flex-row gap items-center">
            <Image src={logo2} alt="logo" height={32} width={32} />
            <h1 className="text-2xl font-black text-white">Flipper</h1>
          </div>
        </nav>

        <section className="hero w-full relative h-[70vh] flex flex-col p-5">
          <div className="flex-1"></div>
          <div className="flex-1 flex-col justify-between text-white">
            <div>
              <h1 className="text-[38px] font-black">Fund,</h1>
              <h1 className="text-[38px] font-black">Play,</h1>
              <h1 className="text-[38px] font-black">Win USDT</h1>
            </div>
            <p className="mt-12 font-regular text-[#c8c8c8] text-[16px]">Web3 powered casino games with instant payout. No banks, no wallets, just stablecoins.</p>
          </div>
          
          <Image src={background} className="absolute right-0 top-0" alt="background"/>
        </section>

        <div className="w-full flex flex-row items-center h-13 gap-2 px-5 mt-26">
          <div className="h-full rounded-[5px] border-2 border-[#b2fa63] flex items-center justify-center px-3">
            <Image src={question} height={24} width={24} alt="question" />
          </div>
          <button className="cursor-pointer h-full w-full bg-[#b2fa63] text-black font-black text-regular flex flex-row items-center justify-center gap-2 rounded-[5px] lg:hidden">
            <span>Start Playing</span>
            <Image src={arrow} alt="arrow" height={11} width={14} />
          </button>
        </div>

      </div>

      <Signin />
      <Image src={footer} className='fixed lg:hidden left-0 bottom-0' alt='Flipper' />
    </main>
  )
}

export default page