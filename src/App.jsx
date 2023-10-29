import React from "react";
import "./App.css";
import Home from "./components/Home/home";
import About from "./components/About/about";
import Works from "./components/Works/works";
import Resume from "./components/Resume/resume";
import Contact from "./components/Contact/contact";
import Sidebar from "./components/Sidebar/sidebar";
import Testimonials from "./components/Testimonials/testimonials";


const App = () => {
  return (
    <div>
        <Sidebar />
        <main className="main">
          <Home />
          <About />
          <Resume />
          <Works />
          <Testimonials />
          <Contact />
        </main>
      </div>
  )
}

export default App
