import React from 'react'
import './home.css';
import HeaderSocials from './HeaderSocials';
import ScrollDown from './ScrollDown';
import Shapes from './Shapes';
import TypingLetter from './typing-letters';
import MyResume from '../../assets/resume__1_.pdf'


const home = () => {
  return (
    <section className="home container" id="home">
      <div className="intro">
        <TypingLetter />
        <HeaderSocials />
        <a href={MyResume} className="btn">Hire Me!</a>
        <ScrollDown />
      </div>
      <Shapes />
    </section>
  )
}

export default home
