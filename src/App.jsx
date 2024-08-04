import React from 'react';
import { BrowserRouter as Router, Routes, Route, HashRouter, } from 'react-router-dom';
import Home from "./components/Home/home";
import Navbar from './components/Home/Navbar';
import About from "./components/About/about";
import Works from "./components/Works/works";
import Resume from "./components/Resume/resume";
import Contact from "./components/Contact/contact";
import Testimonials from "./components/Testimonials/testimonials";
import P5Canvas from './components/Game/P5Canvas';

const BackButton = () => {

  const handleBack = () => {
    window.location.href = '/' // Navigate to the previous page
  };

  return (
    <button
      onClick={handleBack}
      className="fixed top-4 left-4 text-2xl text-white bg-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:outline-none"
    >
      👈🏾
    </button>
  );
};

const App = () => {
  return (
    <HashRouter>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {window.location.pathname === '/' ? <Navbar /> : null}
      {window.location.pathname == '/finally' ? <BackButton/> : null}
        <Routes>
          <Route path="/#" element={
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
    </HashRouter>
  );
};

export default App;
