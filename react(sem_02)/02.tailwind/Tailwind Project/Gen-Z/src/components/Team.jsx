import React from 'react'
import { teams } from '../assets/assets.js'

function Team() {
  return (
    <div className='w-full py-16 bg-gray-50'>
      <div className='container mx-auto px-6 sm:px-12 md:px-24 lg:px-40'>
        
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-800 mb-4'>Meet Our Team</h2>
          <p className='text-gray-500 max-w-2xl mx-auto'>
            Our diverse and dedicated team of professionals is here to help you achieve your goals.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 '>
          {
            teams.map((val, index) => (
              <div 
                key={index} 
                className='bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden hover:-translate-y-9 duration-300 transition-all group '
              >
                
                <div className='w-full h-80 sm:h-64 md:h-72 overflow-hidden  relative bg-gray-200'>
                  <img 
                    src={val.image} 
                    alt={val.name}
                    className='w-full h-full object-cover object-top group-hover:scale-110 duration-500 transition' 
                  />
                </div>

                <div className='p-6 text-center bg-white relative'>
                    <h1 className='text-xl font-bold text-gray-800 mb-1'>{val.name}</h1>
                    <p className='text-amber-500 font-medium text-   tracking-wide uppercase'>{val.designation}</p>
                </div>

              </div>
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Team