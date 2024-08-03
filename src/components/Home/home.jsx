import React from 'react'
import './home.css';
import HeaderSocials from './HeaderSocials';
import ScrollDown from './ScrollDown';
import Shapes from './Shapes';
import TypingLetter from './typing-letters';
import MyResume from '/assets/resume__1_.pdf';


const home = () => {
  const handleClick = () => {
    const element = document.getElementById("contact");
    element.scrollIntoView({behavior: 'smooth'});
  }
  return (
    <section className="home container" id="home">
      <div className="intro">
        <p>Hey 👋, I'm Senthilnathan! A passionate software engineer</p>
        <TypingLetter />
        <HeaderSocials />
        <div className="flex flex-row justify-center items-center mt-[50px]">
          <button onClick={() => handleClick()} className="mx-3 text-white bg-[#ff4d61] hover:[#ff4d61] focus:outline-none focus:ring-4 focus:ring-[#ff4d61] font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">work with me</button>
          <button onClick={() => handleClick()} className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">check my profile</button>
        </div>
        <ScrollDown />
      </div>
      <Shapes />
    </section>
  )
}

export default home
