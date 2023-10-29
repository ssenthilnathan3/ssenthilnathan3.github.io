import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const TypingLetter = () => {
    return (
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'I am a Student',
            750, // wait 1s before replacing "Mice" with "Hamsters"
            'I am an Engineer',
            750,
            'I am a Developer',
            750,
            'I am #me',
            750
          ]}
          wrapper="span"
          speed={50}
          style={{ fontSize: '1.5em', display: 'inline-block' }}
          repeat={Infinity}
          // className="home__education"
        />
      );
}

export default TypingLetter