import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'framer-motion'
const Description = () => {
  return (
    <motion.div 
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    className='flex flex-col items-center justify-center my-24 p-6 md:px-26'>
        <h1 className='text-3xl sm:text-4xl font-semibold mb-2 '>
            Create AI-generated images
        </h1>
        <p className='text-gray-500 mb-8'>Transform your ideas into stunning images with our AI-powered generator.</p>

        <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>
            <img src={assets.sample_img_1} className='w-80 xl:w-96 rounded-lg'/>
            <div className=''>
                <h2 className='text-3xl font-medium max-w-lg mb-4'>
                    Introducing Imagify AI - your ultimate text-to-image generator.
                </h2>
                <p className='text-gray-600 mb-4'>Simply enter a description, and watch as our advanced AI crafts stunning visuals in seconds. Perfect for designers, marketers, and creatives looking to bring their ideas to life effortlessly.</p>

                <p className='text-gray-600'>
                    Ease of Use: Our intuitive interface makes it simple to generate images. Just type in your text prompt, select your desired style, and let the AI do the rest.
                </p>
            </div>
        </div>
    </motion.div>
  )
}

export default Description