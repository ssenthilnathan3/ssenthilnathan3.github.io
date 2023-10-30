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
          <p className="section--title">#whoami</p>
          <h1 className="skills-section--heading">About Me</h1>
          <p className="hero--section-description">
            Hey there👋! I'm a tech-savvy student with a knack for all things in{" "}
            <i>ai and data science</i>. I'm the go-to person when it comes to
            building awesome mobile apps. Whether it's{" "}
            <strong>Java, Kotlin, Swift, or React Native</strong>, I'm your guy.
            I've also had my hands on machine learning, diving into the world of
            algorithms and data crunching.
          </p>
          <p className="hero--section-description">
            So, if you're looking for a tech-savvy, problem-solving enthusiast
            to join your team, let's chat and make things happen!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
