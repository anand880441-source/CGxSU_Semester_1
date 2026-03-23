import React from 'react'
import {Routes, Route } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Nav from "./components/Nav.jsx"
import About from './pages/About.jsx'
import Career from './pages/Carrer.jsx'
import Support from './pages/Support.jsx'
import FloatingAudioPlayer from './components/FloatingAudioPlayer.jsx'

export default function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/about' element= {<About/>}/>
        <Route path='/carrer' element= {<Career/>}/>
        <Route path='/support' element= {<Support/>}/>
      </Routes>
      <FloatingAudioPlayer/>
    </>
  )
}
