import React from "react";
import Img from "../../assets/about-me.jpg";
import "./about.css";

const About = () => {
  return (
    <section id="about" className="about--section">
      <div className="about--section--img">
        <img src={Img} alt="About Me" />
      </div>
      <div className="hero--section--content--box about--section--box">
        <div className="hero--section--content">
          <p className="section--title">About</p>
          <h1 className="skills-section--heading">About Me</h1>
          <p className="hero--section-description">
            I am a dedicated Bachelor of Technology student with a strong
            background in Artificial Intelligence and Data Science. My expertise
            encompasses mobile app development and machine learning, supported
            by practical experience in various tech-related roles.
          </p>
          <p className="hero--section-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
            officiis sit debitis omnis harum sed veniam quasi dicta accusamus
            recusandae?
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
