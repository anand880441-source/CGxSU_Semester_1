import React, { useState } from 'react'
import { FaArrowRightLong, FaBars, FaXmark } from 'react-icons/fa6'

export default function Nav() {

    var [menuBar, setMenu] = useState(false);
    return (

        // Navigation Bar.....
        <div className="w-full fixed top-0 z-78 border-2 backdrop-blur-2xl">

            {/* Actual div which will contain the total three content used in navbar */}
            <div className="flex items-center justify-between px-6 py-8  sm:px-12 md:px-24 lg:40 ">
                {/* Logo */}
                <div>
                    <div className="w-4 h-4 rounded-full bg-purple-800 animate-ping"></div>
                    <p className="text-2xl font-bold">Gen-Z</p>
                    <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                </div>

                {/* Nav bar */}
                <div className="hidden sm:flex items-center justify-between space-x-6 font-semibold">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#Career">Career</a>
                </div>

                {/* Button */}
                <div className="hidden sm:block">
                    <button className=" flex items-center gap-2 px-4 py-4 bg-amber-500 rounded-full">
                        Contact us
                        <FaArrowRightLong />
                    </button>
                </div>

                {/* Mobile responsive bar */}
                {
                    menuBar ? <FaXmark onClick={() => { setMenu(!menuBar) }} className=" font-semibold text-3xl z-10 sm:hidden" /> :
                        <FaBars onClick={() => { setMenu(!menuBar) }} className=" text-3xl font-semibold sm:hidden" />
                }

                {/* mobile nav bar */}
                {
                    menuBar && <div className=" font-semibold text-2xl  flex flex-col items-center justify-center space-y-6 fixed top-0 right-0 h-screen w-50 bg-amber-400 sm:hidden">
                        <a onClick={() => { setMenu(!menuBar) }} href="#home">Home</a>
                        <a onClick={() => { setMenu(!menuBar) }} href="#about">About</a>
                        <a onClick={() => { setMenu(!menuBar) }} href="#Career">Career</a>
                        <div> 
                            <button onClick={() => { setMenu(!menuBar) }} className=" flex items-center gap-2 px-2.5 py-2.5 bg-amber-500 rounded-full">
                                Contact us
                                <FaArrowRightLong />
                            </button>
                        </div>

                    </div>

                }
            </div>
        </div>
    )
}






































// import React, { useState } from 'react'
// import { FaArrowRightLong, FaBars, FaXmark } from 'react-icons/fa6'

// export default function Nav() {

//     var[showMenu, setMenu] = useState(false);

//   return (
//     <div className="w-full fixed top-0 z-50 backdrop-blur-2xl">
//       <div className="flex items-center justify-between px-6 py-8 sm:px-12 md:px-24 lg:px-40 border-2">
//             {/* Logo section */}
//             <div>
//                 <span className="text-2xl font-bold ">Gen-Z</span>
//                 <div className="w-4 h-4 bg-amber-500 border-2 rounded-full"></div>
//             </div>


//             {/* Nav bar section */}
//             <div className=" hidden sm:flex items-center justify-between space-x-8 font-semibold">
//                 <a href="#Home">Home</a>
//                 <a href="#About">About</a>
//                 <a href="#Career">Career</a>
//                 <a href="#Support">Support</a>

//             </div>

//             {/* Contact us */}
//             <div className="hidden sm:block">
//                 <button className=" px-3 py-1 flex items-center gap-3 bg-amber-300 rounded-full">
//                     Contact us
//                     <FaArrowRightLong/>
//                 </button>
//             </div>

//             {/* Mobile menu bar */}
//                 {
//                     showMenu?
//                     <FaBars onClick={()=>{setMenu(!showMenu)}}  className="text-2xl font-semibold font-black/50 sm:hidden"/>:
//                      <FaXmark onClick={()=>{setMenu(!showMenu)}} className="text-2xl font-semibold font-black/50 sm:hidden"/>
//                 }
//       </div>
//     </div>
//   )
// }
