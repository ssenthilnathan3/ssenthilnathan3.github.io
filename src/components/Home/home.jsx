import React from 'react'
import './home.css';
import Me from '../../assets/avatar.jpg';
import HeaderSocials from './HeaderSocials';
import ScrollDown from './ScrollDown';
import Shapes from './Shapes';
// import TypeAnimation from 'react-type-animation';
import TypingLetter from './typing-letters';



const home = () => {
  return (
    <section className="home container" id="home">
      <div className="intro">
        <img src={Me} alt="Naan thaan" className="home__img" />
        <h1 className="home__name">Senthilnathan</h1>
        <TypingLetter />
        {/* <span className="home__education">I'm a student</span> */}
        <HeaderSocials />
        <a href="#contact" className="btn">Hire Me!</a>
        <ScrollDown />
      </div>
      <Shapes />
    </section>
  )
}

export default home
