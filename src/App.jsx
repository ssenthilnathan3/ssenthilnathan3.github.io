import React from "react";
import "./App.css";
import Home from "./components/Home/home";
import About from "./components/About/about";
import Works from "./components/Works/works";
import Resume from "./components/Resume/resume";
import Contact from "./components/Contact/contact";
import Testimonials from "./components/Testimonials/testimonials";

const App = () => {
  return (
    <div className="main">
        <Home />
        <About />
        <Resume />
        <Works />
        <Testimonials />
        <Contact />
    </div>
  );
};

export default App;
