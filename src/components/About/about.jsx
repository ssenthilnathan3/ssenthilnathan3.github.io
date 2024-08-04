import React from "react";
import {motion} from 'framer-motion';
import Img from "/assets/about-me.jpg";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import Senthil from '/assets/me.jpg'

const About = () => {
  return (
    <div className="mt-10 mx-10 grid grid-rows-1 lg:grid-rows-2 gap-2" id="about">
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center max-w-full px-2">
          before you go to my pic and the numbers
        </p>
        <div className="flex mt-3 justify-center items-center w-full sm:w-[80%] lg:w-[40%] text-xs sm:text-sm md:text-base text-gray-600 text-center max-w-full px-2">
          me is a passionate engineer who is currently in his final year! majors in artificial intelligence and data science 🤖 went in data science for the money but stayed because of passion
        </div>

        <div className="flex flex-col lg:flex-row mt-10 gap-10 lg:divide-x divide-solid">
          <div className="flex flex-col p-5">
            <p className="text-3xl font-bold text-blue-600">03 years</p>
            <p className="text-center">project experience</p>
          </div>
          <div className="flex flex-col p-5">
            <p className="text-3xl font-bold text-blue-600">2+ years</p>
            <p className="text-center">app dev experience</p>
          </div>
          <div className="flex flex-col p-5">
            <p className="text-3xl font-bold text-blue-600">5+ projects</p>
            <p className="text-center">delivered</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
          <div className="flex flex-col items-center justify-center gap-3 lg:mr-3">
            <div className="flex flex-col items-start gap-2 w-full max-w-md">
              <div className="flex items-center gap-6 w-full">
                <div className="ml-auto">Web Development</div>
                <div className="relative inline-flex items-center px-3 text-sm font-medium text-center text-white bg-[#e2e8f0] rounded-lg h-10">
                  🔥
                </div>
              </div>
              <div className="text-base lg:text-right text-gray-500 w-full">
                developing aesthetic and intuitive websites for almost 3 years!
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full max-w-md mt-10">
              <div className="flex items-center gap-6 w-full">
                <div className="ml-auto">App Development</div>
                <div className="relative inline-flex items-center px-3 text-sm font-medium text-center text-white bg-[#e2e8f0] rounded-lg h-10">
                  🔥
                </div>
              </div>
              <div className="text-base lg:text-right text-gray-500 w-full">
                developed and deployed 3+ apps in diverse sectors including healthcare, edtech and administration!
              </div>
            </div>
          </div>

          <motion.div className="flex items-center justify-center lg:col-span-1">
            <div className="relative w-full max-w-md h-1/2 lg:w-3/4 lg:h-3/4">
              <img
                src={Senthil}
                alt="Your Image"
                className="w-full h-full object-cover rounded-tl-xl rounded-tr-xl"
              />
              <div className="absolute top-0 right-0 z-20 p-2 text-sm font-medium text-white text-2xl rounded-lg">
                😎
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col items-center justify-center gap-3 lg:mr-3">
            <div className="flex flex-col items-start gap-2 w-full max-w-md">
              <div className="flex items-center gap-6 w-full">
                <div className="relative inline-flex items-center px-3 text-sm font-medium text-center text-white bg-[#e2e8f0] rounded-lg h-10">
                  🔥
                </div>
                <div className="mr-auto">Backend Development</div>
              </div>
              <div className="text-base/2 text-left text-gray-500 w-full">
                developed robust systems for managing real-time communication between 2000+ users! (at a certain point in time)
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full max-w-md mt-10">
              <div className="flex items-center gap-6 w-full">
                <div className="relative inline-flex items-center px-3 text-sm font-medium text-center text-white bg-[#e2e8f0] rounded-lg h-10">
                  🔥
                </div>
                <div className="mr-auto">Embedded Systems</div>
              </div>
              <div className="text-base text-left text-gray-500 w-full">
                hobby turned passion which made me get into engineering!
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default About;
