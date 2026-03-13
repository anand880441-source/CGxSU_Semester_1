import React from 'react'
import { assets } from "../assets/assets.js"

export default function Hero() {
    return (
        // // Parent div for new section to consume all the contents....
        <div className='w-full py-40 ' >
            {/* Container section */}
            <div className='container  mx-auto '>
                {/* div element which will contain the images and information */}
                <div className='flex items-center justify-center gap-6 mx-auto w-full  rounded-full bg-amber-400 py-1 mb-10 md:w-[30%]'>
                    {/* Four overlapped images */}
                    <div className='flex items-center -space-x-3'>
                        <img className='w-8 h-8 rounded-full object-cover object-center' src={assets.profile1Img} alt="" />
                        <img className='w-8 h-8 rounded-full object-cover object-center' src={assets.profile2Img} alt="" />
                        <img className='w-8 h-8 rounded-full object-cover object-center' src={assets.profile3Img} alt="" />
                        <img className='w-8 h-8 rounded-full object-cover object-center' src={assets.profile4Img} alt="" />
                    </div>
                    <span>Trusted by 10k+ Clients</span>
                </div>

                {/* Parargraph content */}
                <h1 className='text-center text-4xl text-black/50 mb-6 sm:text-5xl md:text-6xl lg:text-7xl'>
                    We Grow brands with
                    <br />
                    <span className='text-amber-300'>Proffesional</span> Strategy
                </h1>

                {/* Large Statment paragraph */}
                <p className='text-center font-semibold text-xl mx-w-xl mx-auto px-2 mb-10'>At our agency, we take pride
                     that deliver the projects that have creativity, strategy, and technology. </p>

                {/* Two buttons -> contact us and feedback */}
                <div className='flex items-center justify-center gap-8'>
                    <button className='font-semibold bg-amber-500 px-4 py-3 rounded-full hover:scale-105 
                    duration-150 transition cursor-pointer'>Contact us</button>
                    <button className='font-semibold bg-cyan-950 text-white px-4 py-3 rounded-full
                     hover:scale-105 duration-150 transition cursor-pointer'>Feedback</button>
                </div>

                {/* Hero image */}
                <div className='mt-12 mx-auto mx-w-xl border-2'>
                    <img className='w-full h-full object-center' src={assets.heroImg} alt="" />
                </div>
            </div>
        </div>
        // // Parent div for new section to consume all the contents....
        // <div className='w-full py-40 '>
        //     {/* container defined */}
        //     <div className='container mx-auto px-6 '>
        //         {/* images + content */}
        //         <div className='flex items-center justify-center gap-6 w-full mx-auto bg-amber-400 rounded-full pl-2 py-2 mb-12 md:w-[25%]'>
        //             {/* four images inside one div tag */}
        //             <div className='flex items-center -space-x-3'>
        //                 <img className='w-8 h-8 rounded-full object-cover object-center' src={assets.profile1Img} alt="" />
        //                 <img className='w-8 h-8 rounded-full object-cover object-center' src={assets.profile2Img} alt="" />
        //                 <img className='w-8 h-8 rounded-full object-cover object-center'  src={assets.profile3Img} alt="" />
        //                 <img  className='w-8 h-8 rounded-full object-cover object-center' src={assets.profile4Img} alt="" />
        //             </div>
        //             <span>Trusted by 10k+ clients</span>
        //         </div>

        //         {/* Parargraph */}

        //         <h1 className='text-center text-black/50 text-4xl mb-8 sm:text-5xl md:text-6xl lg:text-7xl'>
        //             We Grow brands with 
        //             <br />
        //             <span className='text-amber-300'>performance</span> strategy
        //         </h1>

        //         {/* paragraph */}
        //         <p className='text-center mx-w-xl mx-auto font-semibold mb-8'>At our agency,
        //              we take pride that deliver the products which contains Creativity, Strategy, and technology.</p>

        //         {/* Buttons -> 2 */}
        //         <div className='flex items-center justify-center gap-8'>
        //             <button className=' p-3 bg-amber-300 rounded-full font-semibold hover:scale-105 duration-100 transition cursor-pointer'>
        //                 Contact us </button>
        //             <button className=' p-3 bg-cyan-950 text-white rounded-full font-semibold hover:scale-105 duration-100 transition cursor-pointer'>
        //                 Feedback</button>
        //         </div>

        //         {/* Image to end this section */}
        //         <div className='mt-15 mx-w-5xl mx-auto shadow-overflow-hidden rounded-2xl'>
        //             <img className='w-full h-full object-center ' src={assets.heroImg} alt="" />
        //         </div>
        //     </div>
        // </div>
    )
}
