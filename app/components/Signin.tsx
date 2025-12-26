import React from 'react'
import Image from 'next/image'
import user from "@/app/static/images/user_icon.svg"
import mail from "@/app/static/images/mail_icon.svg"
import pw from "@/app/static/images/password_icon.svg"
import Link from 'next/link'

const Signin = () => {
  return (
    <div className='pt-10.5 px-6 lg:border-0 border-t pb-18 lg:flex-1'>
        <h1 className="text-white font-semibold text-[40px]">Sign In</h1>
        <div className="mt-12 flex flex-col items-center w-full">
            <div className="h-14 border border-[#B2FA63] w-full rounded-lg px-2.5 lg:px-3.5 py-4.5 flex flex-row gap-4 items-center">
                <Image src={mail} height={20} width={20} alt="user" />
                <input className='bg-transparent outline-0 focus:outline-0 text-white font-medium text-[14px]' placeholder='Email' />
            </div>
            <div className="mt-9 h-14 border border-[#B2FA63] w-full rounded-lg px-2.5 lg:px-3.5 py-4.5 flex flex-row gap-4 items-center">
                <Image src={pw} height={20} width={20} alt="user" />
                <input className='bg-transparent outline-0 focus:outline-0 text-white font-medium text-[14px]' placeholder='Password' />
            </div>
            <div className="ml-auto mt-2.5 text-[#b2fa63]">Forgot password?</div>
            <button className="mt-9 h-14 bg-[#B2FA63] font-semibold text-[22px] w-full rounded-lg text-black">SIGN IN</button>
        </div>

        <p className="text-white text-[14px] mt-7 text-center">Don't have an account? <Link href="/#signup" className='text-[#b2fa63]'>Sign Up</Link></p>
    </div>
  )
}

export default Signin