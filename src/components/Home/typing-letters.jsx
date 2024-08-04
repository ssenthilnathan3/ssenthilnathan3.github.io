import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const TypingLetter = () => {
  return (
    <TypeAnimation
      sequence={[
        '',
        750,
        'App Developer',
        750,
        'Nextjs Developer',
        750,
        'Backend Engineer',
      ]}
      wrapper="span"
      speed={50}
      style={{ fontSize: '2em', fontWeight: 'bold', display: 'inline-block',fontFamily: "DM Sans" }}
      repeat={100}
    // className="home__education"
    />
  );
}

export default TypingLetter