import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home/home";
import Navbar from './components/Home/Navbar';
import About from "./components/About/about";
import Works from "./components/Works/works";
import Resume from "./components/Resume/resume";
import Contact from "./components/Contact/contact";
import Testimonials from "./components/Testimonials/testimonials";
import P5Canvas from './components/Game/P5Canvas';

const App = () => {
  return (
    <Router>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <About />
              {/* <Resume /> */}
              {/* <Contact /> */}
              <Testimonials />
              <P5Canvas />
            </>
          } />
          
          <Route path="/finally" element={<Works />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
