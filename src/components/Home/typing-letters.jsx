import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const TypingLetter = () => {
  return (
    <TypeAnimation
      sequence={[
        '',
        750,
        'I am a software engineer',
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: '2em', fontWeight: 'bold', display: 'inline-block' }}
      repeat={0}
    // className="home__education"
    />
  );
}

export default TypingLetter