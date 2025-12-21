import React from 'react'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'

const footer = () => {
  return (
    <motion.div
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}} 
    className='flex items-center justify-center gap-4 py-3 mt-20'>
        <img src={assets.logo} width={150}/>
        <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>© 2025 Imagify. All rights reserved.</p>
        <div className='flex gap-2.5'>
            <img src={assets.facebook_icon} width={35}/>
            <img src={assets.twitter_icon} width={35}/>
            <img src={assets.instagram_icon} width={35}/>
        </div>
    </motion.div>
  )
}

export default footer