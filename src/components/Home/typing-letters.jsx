import React from 'react'
import { TypeAnimation } from 'react-type-animation';

const TypingLetter = () => {
    return (
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed out once, initially
            'I am a curious student',
            750, // wait 1s before replacing "Mice" with "Hamsters"
            'I am an innovative engineer',
            750,
            'I am a creative thinker',
            750,
            'I am a self-starter',
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