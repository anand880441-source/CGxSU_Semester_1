import React, { useState } from 'react';
import { FaSearch, FaHeadset, FaUsers, FaBook } from 'react-icons/fa';
import Footer from '../components/Footer.jsx';
import { FaCircleQuestion } from 'react-icons/fa6';

export default function Support() {
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault()
        setFormSubmitted(true)
    }
    const supportCategories = [
        {
            id: 1,
            icon: <FaHeadset className="text-4xl text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: "Expert Support",
            description: "Get in touch with our dedicated support team for personalized assistance with your projects.",
            actionText: "Contact Us"
        },
        {
            id: 2,
            icon: <FaUsers className="text-4xl text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: "Community Forum",
            description: "Join our vibrant community of creators to share ideas, ask questions, and collaborate.",
            actionText: "Join Community"
        },
        {
            id: 3,
            icon: <FaBook className="text-4xl text-amber-500 mb-4 group-hover:scale-110 transition-transform duration-300" />,
            title: "Knowledge Base",
            description: "Browse through our comprehensive guides, FAQs, and documentation to find quick answers.",
            actionText: "Explore Docs"
        }
    ];

    const faqs = [
        {
            question: "How can I start a project with Gen-Z?",
            answer: "You can start by clicking the 'Contact Us' button in the navbar or at the bottom of the support page. We'll set up a discovery call to discuss your goals."
        },
        {
            question: "What industries do you specialize in?",
            answer: "We work with forward-thinking brands across fintech, e-commerce, SaaS, and lifestyle sectors that want to reach the next generation."
        },
        {
            question: "Do you offer post-launch support?",
            answer: "Absolutely. We provide various maintenance and support packages to ensure your digital products stay updated and perform at their best."
        },
        {
            question: "How long does a typical design project take?",
            answer: "Timelines vary depending on scope, but a standard branding or web project typically takes 4-8 weeks from kickoff to delivery."
        }
    ]

    return (
        <>
            <div className="w-full py-24 bg-gradient-to-b from-gray-50 mt-20  to-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64  bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-950 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-6 sm:px-12 md:px-24 xl:px-40 relative z-10">

                    {/* Header section */}
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">help you?</span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-10">
                            We are here to ensure you have the best experience. Search below or explore our support channels.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 text-lg group-focus-within:text-amber-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 md:py-5 border-2 border-transparent bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 text-lg"
                                placeholder="Search for guides, FAQs, or topics..."
                            />
                            <div className="absolute inset-y-0 right-2 flex items-center">
                                <button className="bg-cyan-950 text-white px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-cyan-900 hover:scale-105 transition-all duration-300 shadow-md">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Support Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-6xl mx-auto">
                        {supportCategories.map((category) => (
                            <div
                                key={category.id}
                                className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transform hover:-translate-y-2 transition-all duration-300 group border border-gray-100 flex flex-col h-full"
                            >
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                                        {category.icon}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{category.title}</h3>
                                <p className="text-gray-600 mb-8 flex-grow">{category.description}</p>
                                <button className="text-amber-500 font-semibold tracking-wide uppercase inline-flex items-center justify-center gap-2 group-hover:text-amber-600 transition-colors">
                                    {category.actionText}
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Quick Contact Banner */}
                    <div className="mt-20 bg-cyan-950 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
                        {/* Subtle overlay lines or circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full translate-x-8 -translate-y-8"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400 opacity-10 rounded-full -translate-x-12 translate-y-12"></div>

                        <div className="relative z-1 ">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-wide">Still need help?</h3>
                            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                                Our support team is available 24/7 to assist you with any questions or issues you might face. We're just an email or a call away.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <button className="bg-amber-400 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-amber-300 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                                    Call Us Now
                                </button>
                                <button className="bg-transparent border-2 border-gray-500 text-white px-8 py-4 rounded-full font-bold hover:border-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto">
                                    Email Support
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Support Our Growth Section */}
                    <section className=" mt-15 rounded-2xl py-20 px-6 sm:px-12 md:px-24 lg:px-40 bg-amber-400">
                        <div className="max-w-4xl mx-auto text-center text-black">
                            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Support Our Growth 🚀</h2>
                            <p className="text-lg font-medium mb-12 opacity-90 max-w-2xl mx-auto">
                                We're a small team building big things. If you love what we're doing,
                                consider supporting us with a small contribution. Every bit helps us
                                stay independent and keeps the innovation flowing!
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6">
                                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 hover:bg-white/30 transition-all duration-300">
                                    <div className="text-4xl mb-4">☕️</div>
                                    <h3 className="text-xl font-bold mb-2">Buy us a Coffee</h3>
                                    <p className="text-sm font-medium opacity-80 mb-6">$5 • One-time</p>
                                    <button className="w-full py-2 bg-white text-black font-bold rounded-full hover:scale-105 duration-200 cursor-pointer">Support →</button>
                                </div>

                                <div className="bg-white/40 backdrop-blur-md border border-white/50 rounded-3xl p-8 hover:bg-white/50 transition-all duration-300 shadow-xl shadow-amber-900/10 scale-105">
                                    <div className="text-4xl mb-4">🍕</div>
                                    <h3 className="text-xl font-bold mb-2">Team Pizza Fund</h3>
                                    <p className="text-sm font-medium opacity-80 mb-6">$25 • Keep us fueled</p>
                                    <button className="w-full py-2 bg-black text-white font-bold rounded-full hover:scale-105 duration-200 cursor-pointer">Support →</button>
                                </div>

                                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 hover:bg-white/30 transition-all duration-300">
                                    <div className="text-4xl mb-4">🛠️</div>
                                    <h3 className="text-xl font-bold mb-2">Sponsor a Feature</h3>
                                    <p className="text-sm font-medium opacity-80 mb-6">$100+ • Enterprise love</p>
                                    <button className="w-full py-2 bg-white text-black font-bold rounded-full hover:scale-105 duration-200 cursor-pointer">Support →</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section className="py-20 px-6 sm:px-12 md:px-24 lg:px-40 bg-gray-50">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide uppercase">
                                    Common Questions
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm hover:border-amber-300 transition-colors">
                                        <h3 className="text-gray-900 font-bold text-lg mb-3 flex items-start gap-3">
                                            <FaCircleQuestion  className="text-amber-500 mt-1 flex-shrink-0" />
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-500 leading-relaxed md:ml-9 text-sm">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Contact Form Section */}
                    <section className="py-20 px-6 sm:px-12 md:px-24 lg:px-40 bg-gray-50">
                        <div className="grid lg:grid-cols-2 gap-16 items-start">

                            {/* Left - Contact Info */}
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                                <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                                    Prefer a direct conversation? We're available across multiple channels.
                                    Our typical response time is under 4 hours during business days.
                                </p>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
                                            📧
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Email Us</p>
                                            <p className="text-xl font-bold text-gray-900">hello@gen-zgmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
                                            📱
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Call Us</p>
                                            <p className="text-xl font-bold text-gray-900">+91-94099 99999</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
                                            📍
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Visit Us</p>
                                            <p className="text-xl font-bold text-gray-900">Ahmedabad, Gujarat, India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Form */}
                            <div className="bg-white border border-amber-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-amber-900/5">
                                {formSubmitted ? (
                                    <div className="text-center py-10">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                                            ✓
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                        <p className="text-gray-500">We've received your request and will get back to you shortly.</p>
                                        <button
                                            onClick={() => setFormSubmitted(false)}
                                            className="mt-8 text-amber-500 font-bold hover:underline cursor-pointer"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                                                    placeholder="Gen-Z People"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-gray-700">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                                                    placeholder="genz@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Subject</label>
                                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all cursor-pointer">
                                                <option>General Inquiry</option>
                                                <option>Project Request</option>
                                                <option>Technical Support</option>
                                                <option>Billing Question</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700">Message</label>
                                            <textarea
                                                rows="4"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all"
                                                placeholder="Tell us how we can help..."
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-500 transition-all duration-300 shadow-lg shadow-amber-400/20 cursor-pointer"
                                        >
                                            Send Message →
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>

                </div>

            </div>

            <Footer />
        </>
    );
}