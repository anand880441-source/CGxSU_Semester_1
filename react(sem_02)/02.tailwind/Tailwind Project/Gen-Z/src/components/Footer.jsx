import React from 'react'

function Footer() {
    return (
        <footer className="bg-[#0f172a] text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

                <div>
                    <div className="w-4 h-4 rounded-full bg-purple-800 animate-ping"></div>
                    <p className="text-2xl font-bold">Gen-Z</p>
                    <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                    <p className="mt-4 text-sm">
                        Helping brands grow with strategy, creativity and technology.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:text-yellow-500">Home</a></li>
                        <li><a href="#" className="hover:text-yellow-500">About</a></li>
                        <li><a href="#" className="hover:text-yellow-500">Career</a></li>
                        <li><a href="#" className="hover:text-yellow-500">Contact s</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Services</h3>
                    <ul className="space-y-2">
                        <li>UI/UX Design</li>
                        <li>Web Development</li>
                        <li>Brand Strategy</li>
                        <li>SEO</li>
                        <li>Digital Marketing</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-4">Newsletter</h3>
                    <p className="text-sm mb-4">
                        Subscribe to get updates about our latest projects.
                    </p>

                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="w-full px-3 py-2 rounded-l-md text-black outline-none bg-gray-200"
                        />
                        <button className="bg-yellow-500 px-4 rounded-r-md text-black font-semibold">
                            Join
                        </button>
                    </div>
                </div>

            </div>

            <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm">
                &copy; 2026 Gen-Z . All rights reserved.
            </div>
        </footer>
    )
}

export default Footer