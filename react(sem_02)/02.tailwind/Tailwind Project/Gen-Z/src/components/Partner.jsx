import React from 'react'
import { FaAmazon, FaGit, FaGithub, FaMicrosoft, FaTwitter, FaWhatsapp, FaYoutube } from 'react-icons/fa'

export default function Partner() {
  return (
    <div className='w-full bg-white '>
      <div className='container  mx-auto pb-7  flex flex-col gap-8 items-center'>
        <h1 className='font-semibold text-4xl  sm:text-5xl'>Trusted by 10k+ partners...</h1>
        <div className='w-full flex flex-wrap gap-4  sm:gap-6 md:gap-8 justify-center items-center '>
            <div className='w-10 h-10 border-2 border-amber-400 flex items-center justify-center rounded-full sm:w-18 sm:h-18 hover:scale-105 duration-300 transition cursor-pointer '>
              <FaMicrosoft className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12'/>
            </div>
            <div className='w-10 h-10 border-2 border-amber-400 flex items-center justify-center rounded-full sm:w-18 sm:h-18 hover:scale-105 hover:bg-blue-500 duration-300 transition cursor-pointer '>
              <FaTwitter className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12'/>
            </div>
            <div className='w-10 h-10 border-2 border-amber-400 flex items-center justify-center rounded-full sm:w-18 sm:h-18 hover:scale-105 hover:bg-green-600 duration-300 transition cursor-pointer '>
              <FaWhatsapp className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12'/>
            </div>
            <div className='w-10 h-10 border-2 border-amber-400 flex items-center justify-center rounded-full sm:w-18 sm:h-18 hover:scale-105 hover:bg-red-600 duration-300 transition cursor-pointer '>
              <FaYoutube className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12'/>
            </div>
            <div className='w-10 h-10 border-2 border-amber-400 flex items-center justify-center rounded-full sm:w-18 sm:h-18 hover:scale-105 hover:bg-purple-600 duration-300 transition cursor-pointer '>
              <FaGithub className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12'/>
            </div>
            <div className='w-10 h-10 border-2 border-amber-400 flex items-center justify-center rounded-full sm:w-18 sm:h-18 hover:scale-105 hover:bg-gray-600 duration-300 transition cursor-pointer '>
              <FaGit className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12'/>
            </div>
           <div className='w-10 h-10 border-2 border-amber-400 flex items-center justify-center rounded-full sm:w-18 sm:h-18 hover:scale-105 hover:bg-amber-400 duration-300 transition cursor-pointer '>
             <FaAmazon className='w-8 h-8 sm:h-10 sm:w-10 md:w-12 md:h-12'/>
           </div>
        </div>
      </div>
    </div>
  )
}
