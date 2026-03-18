import React, { useState } from 'react'
import Footer from '../components/Footer'

const openings = [
  {
    id: 1,
    title: 'Frontend Developer',
    type: 'Full-time',
    location: 'Remote',
    emoji: '💻',
    desc: 'Build stunning UIs using React, Tailwind and modern web tech. You care deeply about performance and pixel-perfect design.',
    tags: ['React', 'Tailwind', 'JavaScript'],
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    type: 'Full-time',
    location: 'Hybrid',
    emoji: '🎨',
    desc: 'Craft beautiful, intuitive experiences from wireframe to final product. You balance aesthetics with usability.',
    tags: ['Figma', 'Prototyping', 'User Research'],
  },
  {
    id: 3,
    title: 'Backend Engineer',
    type: 'Full-time',
    location: 'Remote',
    emoji: '⚙️',
    desc: 'Design and build scalable APIs and services. You love clean architecture, databases, and making things fast.',
    tags: ['Node.js', 'MongoDB', 'REST APIs'],
  },
  {
    id: 4,
    title: 'Marketing Strategist',
    type: 'Part-time',
    location: 'Remote',
    emoji: '📣',
    desc: 'Drive brand awareness and lead generation through creative campaigns. You know how to make noise on the internet.',
    tags: ['SEO', 'Social Media', 'Analytics'],
  },
]

const perks = [
  { icon: '🌍', title: 'Work From Anywhere', desc: 'Fully remote-first culture with flexible hours that fit your lifestyle.' },
  { icon: '📈', title: 'Fast Growth', desc: 'Work on real projects that ship. Your impact is visible from day one.' },
  { icon: '💸', title: 'Competitive Pay', desc: 'We pay for your skills. No lowballing — ever.' },
  { icon: '🎓', title: 'Learning Budget', desc: 'Annual budget for courses, books, and conferences to keep you sharp.' },
  { icon: '🧘', title: 'Mental Wellness', desc: 'Paid mental health days, no-meeting Fridays, and a no-hustle culture.' },
  { icon: '🤝', title: 'Amazing Team', desc: 'Collaborate with talented, humble creators who actually care.' },
]

export default function Career() {
  const [applied, setApplied] = useState(null)

  return (
    <div className="bg-white text-gray-800 min-h-screen">

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 sm:px-12 md:px-24 lg:px-40 text-center bg-amber-50">
        <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-6 tracking-wide uppercase">
          Join Our Team
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
          Build the Future{' '}
          <span className="text-amber-500">With Us</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          We're always looking for passionate, creative people who want to make a real impact.
          No corporate fluff — just great work, great people, and big ideas.
        </p>
        <a
          href="#openings"
          className="inline-block mt-8 px-8 py-3 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-500 transition-all duration-300 shadow-md"
        >
          See Open Roles ↓
        </a>
      </section>

      {/* Perks Section */}
      <section className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 bg-white">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide uppercase">
            Why Gen-Z?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Perks & Benefits</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {perks.map((perk, i) => (
            <div
              key={i}
              className="bg-amber-50 border border-amber-100 rounded-2xl p-6 hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <div className="text-4xl mb-4">{perk.icon}</div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">{perk.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Openings Section */}
      <section id="openings" className="py-16 px-6 sm:px-12 md:px-24 lg:px-40 bg-gray-50">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-100 text-amber-500 text-sm font-semibold px-4 py-1 rounded-full mb-4 tracking-wide uppercase">
            Open Positions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Current Openings</h2>
        </div>

        <div className="flex flex-col gap-6">
          {openings.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-amber-100 rounded-2xl p-6 sm:p-8 hover:border-amber-400 transition-all duration-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              {/* Left */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                  {job.emoji}
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-xl mb-1">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-amber-100 text-amber-600 text-xs font-semibold px-3 py-1 rounded-full">{job.type}</span>
                    <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">{job.location}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xl">{job.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.tags.map((tag, t) => (
                      <span key={t} className="text-xs border border-amber-200 text-amber-600 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="shrink-0">
                {applied === job.id ? (
                  <span className="inline-block px-6 py-2 bg-green-100 text-green-700 font-semibold rounded-full text-sm">
                    ✓ Applied!
                  </span>
                ) : (
                  <button
                    onClick={() => setApplied(job.id)}
                    className="px-6 py-2 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-500 transition-all duration-300 shadow text-sm whitespace-nowrap"
                  >
                    Apply Now →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-12 md:px-24 lg:px-40 text-center bg-amber-50">
        <div className="bg-white border border-amber-200 rounded-3xl py-16 px-6 shadow-md">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900">
            Don't See Your Role?
          </h2>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">
            We're always open to meeting talented people. Send us your portfolio
            and tell us how you'd fit into the Gen-Z family.
          </p>
          <button className="px-6 py-3 bg-amber-400 text-black font-bold rounded-full hover:bg-amber-500 transition-all duration-300 shadow">
            Send Open Application →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}