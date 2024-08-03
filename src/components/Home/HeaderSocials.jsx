import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faLinkedinIn, faGithub, faInstagram } from '@fortawesome/free-brands-svg-icons';
const HeaderSocials = () => {
  return (
    <div className="home__social">
    <a href="https://github.com/ssenthilnathan3" className="home__social_link" target='_blank'>
       <FontAwesomeIcon icon={faGithub} />
    </a>
    <a href="https://linkedin.com/in/ssenthilnathan03" className="home__social_link" target='_blank'>
        <FontAwesomeIcon icon={faLinkedinIn} />
    </a>
    <a href="https://instagram.com/ssenthilnathan_" className="home__social_link" target='_blank'>
       <FontAwesomeIcon icon={faInstagram} />
    </a>
    </div>
  )
}

export default HeaderSocials