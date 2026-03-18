import React from 'react'
import Footer from '../components/Footer'

const stats = [
  { value: '5+', label: 'Years of Experience' },
  { value: '200+', label: 'Projects Delivered' },
  { value: '50+', label: 'Happy Clients' },
  { value: '15+', label: 'Team Members' },
]

const values = [
  {
    icon: '🚀',
    title: 'Innovation First',
    desc: 'We push boundaries with creative solutions tailored for the next generation of digital brands.',
  },
  {
    icon: '🤝',
    title: 'Client Partnership',
    desc: 'We treat every client as a long-term partner, ensuring their growth is always our priority.',
  },
  {
    icon: '🎯',
    title: 'Results Driven',
    desc: 'Our strategies are data-backed and outcome-focused, delivering measurable impact every time.',
  },
  {
    icon: '💡',
    title: 'Creative Excellence',
    desc: 'From design to development, every pixel and line of code reflects our passion for quality.',
  },
]

const team = [
  { name: 'Aryan Shah', role: 'CEO & Founder', emoji: '👨‍💼' },
  { name: 'Priya Mehta', role: 'Head of Design', emoji: '👩‍🎨' },
  { name: 'Rohan Verma', role: 'Lead Developer', emoji: '👨‍💻' },
  { name: 'Sneha Patel', role: 'Marketing Lead', emoji: '👩‍💼' },
]

export default function About() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 sm:px-12 md:px-24 lg:px-40 text-center bg-amber-50">
        <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-6 tracking-wide uppercase">
          Who We Are
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
          Built for the{' '}
          <span className="text-amber-500">Next Generation</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Gen-Z is a creative-tech agency helping brands grow with bold strategy,
          cutting-edge design, and powerful technology. We don't just build
          products — we build experiences.
        </p>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-amber-50 border border-amber-100 rounded-2xl py-8 px-4 hover:border-amber-400 transition-all duration-300 shadow-sm"
            >
              <p className="text-4xl font-extrabold text-amber-500">{s.value}</p>
              <p className="text-gray-500 mt-2 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide uppercase">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-snug text-gray-900">
              How Gen-Z Was Born
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Gen-Z started as a small group of passionate designers and
              developers who believed that digital brands deserved better. We
              saw a gap between creativity and technology and decided to bridge
              it with purpose.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today, we're a full-service creative agency working with startups
              and enterprises across the globe — all driven by the same
              mission: make the web a more beautiful, functional place.
            </p>
          </div>

          {/* Right — decorative card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-100 to-yellow-50 border border-amber-200 rounded-3xl p-10 text-center shadow-md">
              <div className="w-16 h-16 bg-amber-400 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl shadow">
                🌟
              </div>
              <p className="text-gray-900 text-xl font-bold mb-2">
                "Creativity meets Code"
              </p>
              <p className="text-gray-500 text-sm">
                That's the Gen-Z philosophy — where every idea becomes a
                digital reality.
              </p>
            </div>
            {/* Decorative dot */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-amber-400 rounded-full opacity-60 animate-ping" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 bg-white">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide uppercase">
            Our Values
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Drives Us</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="bg-amber-50 border border-amber-100 rounded-2xl p-6 hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="text-4xl mb-4">{v.icon}</div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">{v.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 bg-gray-50">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide uppercase">
            Meet The Team
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">The People Behind Gen-Z</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-white border border-amber-100 rounded-2xl p-6 text-center hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                {member.emoji}
              </div>
              <h3 className="text-gray-900 font-bold">{member.name}</h3>
              <p className="text-amber-500 text-sm mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-12 md:px-24 lg:px-40 text-center bg-amber-50">
        <div className="bg-white border border-amber-200 rounded-3xl py-16 px-6 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">
            Ready to Work With Us?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            Let's build something amazing together. Reach out and let's make
            your brand unforgettable.
          </p>
          <button className="px-6 py-3 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-500 transition-all duration-300 shadow">
            Get in Touch →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}