import React, { useContext, useState } from 'react'
import { assets } from "../assets/assets"
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AppContext } from '../context/AppContext'
const Navbar = () => {
    const {user, setIsLoginOpen, Logout} = useContext(AppContext);
    const navigate = useNavigate();
    return (
        <div className='flex items-center justify-between py-4'>
            <Link to="/"><img src={assets.logo} alt="Logo"
                className='w-28 sm:w-32 lg:w-40' /></Link>

            <div>
                {user ? 
                <div className='flex items-center gap-2 sm:gap-3'>
                    <Button onClick={() => navigate('/buy-credits')} className="flex items-center gap-2 bg-blue-300 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700"><img className='w-5' src={assets.credit_star} alt="User" />
                    <p className='rexr-xs sm:text-sm font-medium text-gray-600'>Credit left : {user?.creditBalance}</p></Button>
                    <p className='text-gray-600 max-sm:hidden pl-4 '>Hi, {user?.name}</p>
                    <div className='relative group'>
                        <img className='w-10 drop-shadow' src={assets.profile_icon} alt="User Avatar" />
                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                            <ul className='list-none m-0 p-2 bg-white rounded-full border text-sm justify-center shadow-lg'>
                                <li onClick={Logout} className='py-1 px-2 cursor-pointer pr-10 '>Logout</li>
                            </ul>
                        </div>
                    </div>
                </div> 
                : 
                <div className='flex items-center gap-2 sm:gap-5'>
                    <p onClick={() => navigate('/buy-credits')} className='cursor-pointer'>Pricing</p>
                    <Button className="cursor-pointer bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full" onClick={() => setIsLoginOpen(true)}>Login</Button>
                    </div>}

            </div>
        </div>

    )
}

export default Navbar