import React, { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
const Generate = () => {
  const {user,setIsLoginOpen} = useContext(AppContext);
  const navigate = useNavigate();
   const onClickHandler = ()=>{
      if(user){
        navigate('/result');
      }else{
        setIsLoginOpen(true);
      }
    }
  return (

   

    <motion.div
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
     className='pb-16 text-center'>
        <h1 className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'>See the magic of Imagify AI</h1>
        <motion.button 
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{default:{duration:0.8},opacity:{duration:1,delay:0.8}}}
        onClick={onClickHandler}
        className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-all duration-500'>Generate Images
            <img src={assets.star_group}
            className='h-6'/>
        </motion.button>
    </motion.div>
  )
}

export default Generate