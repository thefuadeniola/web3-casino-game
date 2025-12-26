"use client"
import { useState } from 'react'
import { useLoginWithEmail } from '@privy-io/react-auth'
import Image from 'next/image'
import user from "@/app/static/images/user_icon.svg"
import mail from "@/app/static/images/mail_icon.svg"
import pw from "@/app/static/images/password_icon.svg"
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from 'next/navigation'
import spinner from '@/app/static/images/spinning-circle.gif'

const Signup = () => {

    const router = useRouter();

    const { ready } = usePrivy();
    const[email, setEmail] = useState('');
    const{sendCode, loginWithCode} = useLoginWithEmail();
    const [codeSent, setCodeSent] = useState(false);
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false);

    const handleSendCode = async () => {
        if(!ready) return;
        if(email === '') {
            alert('Please enter a valid email address');
            return;
        }
        try {
            setLoading(true);
            await sendCode({email});
            setCodeSent(true)
            setLoading(false);
        } catch (error) {
            console.log("Error sending code: ", error);
            alert('Failed to send code. Please try again.');
            return
        }

    }

    const handleSubmit = async () => {
        setEmail('');
        setCode('');

        try {
            setLoading(true);
            await loginWithCode({code})
            router.push('/profile')
        } catch (error) {
            setLoading(false);
            console.log("Error logging in: ", error);
            alert('Failed to log in. Please try again.');
            return
        } finally {
            setCodeSent(false)
        }
    }

  return (
    <div id='signup' className='pt-10.5 px-6 lg:border-0 border-t pb-18 lg:flex-1'>
        <h1 className="text-white font-semibold text-[40px]">Get Started</h1>
        <div className="mt-12 flex flex-col gap-9 items-center w-full">
            <div className="h-14 border border-[#B2FA63] w-full rounded-lg px-2.5 lg:px-3.5 py-4.5 flex flex-row gap-4 items-center">
                <Image src={mail} height={20} width={20} alt="user" />
                <input className='bg-transparent outline-0 focus:outline-0 text-white font-medium text-[14px]' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
            </div>
            {!codeSent && 
            <button disabled={!ready} onClick={handleSendCode} className="h-14 bg-[#B2FA63] flex items-center justify-center font-semibold text-[22px] w-full rounded-lg text-black cursor-pointer">
                {loading ? <Image src={spinner} alt="loading" width={24} height={24} unoptimized/> : 'CONTINUE'}
            </button>}
        </div>
        {
            codeSent && (
            <div className="mt-12 flex flex-col gap-7  w-full">
                <p className="text-white text-left">Enter the code sent to {email}</p>
                <div className="h-14 border border-[#B2FA63] w-full rounded-lg px-2.5 lg:px-3.5 py-4.5 flex flex-row gap-4 items-center">
                    <Image src={pw} height={20} width={20} alt="code" />
                    <input className='bg-transparent outline-0 focus:outline-0 text-white font-medium text-[14px]' value={code} onChange={(e) => setCode(e.target.value)} placeholder='Code' />
                </div>
                <button onClick={handleSubmit} className="h-14 bg-[#B2FA63] font-semibold text-[22px] w-full flex items-center justify-center rounded-lg text-black cursor-pointer">
                    {loading ? <Image src={spinner} alt="loading" width={24} height={24} unoptimized/> : 'SUBMIT'}
                </button>
            </div>

            )
        }

{/*         <p className="text-white text-[14px] mt-7 text-center">Already have an account? <span className='text-[#b2fa63]'>Sign In</span></p>
 */}    </div>
  )
}

export default Signup