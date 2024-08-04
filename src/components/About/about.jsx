import React from "react";
import {motion} from 'framer-motion';
import Img from "/assets/about-me.jpg";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import Senthil from '/assets/senthil.jpg'

const About = () => {
  return (
    <div className="mt-10 mx-10 grid grid-rows-1 lg:grid-rows-2 gap-2">
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center max-w-full px-2">
          before you go to my pic and the numbers
        </p>
        <div className="flex mt-3 justify-center items-center w-full sm:w-[80%] lg:w-[40%] text-xs sm:text-sm md:text-base text-gray-600 text-center max-w-full px-2">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </div>

        <div className="flex flex-col lg:flex-row mt-10 gap-10 lg:divide-x divide-solid">
          <div className="flex flex-col p-5">
            <p className="text-3xl font-bold text-blue-600">03 years</p>
            <p className="text-center">experience</p>
          </div>
          <div className="flex flex-col p-5">
            <p className="text-3xl font-bold text-blue-600">03 years</p>
            <p className="text-center">experience</p>
          </div>
          <div className="flex flex-col p-5">
            <p className="text-3xl font-bold text-blue-600">03 years</p>
            <p className="text-center">experience</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
          <div className="flex flex-col items-center justify-center gap-3 lg:mr-3">
            <div className="flex flex-col items-start gap-2 w-full max-w-md">
              <div className="flex items-center gap-6 w-full">
                <div className="ml-auto">Brand Design</div>
                <div className="relative inline-flex items-center px-3 text-sm font-medium text-center text-white bg-[#e2e8f0] rounded-lg h-10">
                  🔥
                </div>
              </div>
              <div className="text-base lg:text-right text-gray-300 w-full">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full max-w-md mt-10">
              <div className="flex items-center gap-6 w-full">
                <div className="ml-auto">Brand Design</div>
                <div className="relative inline-flex items-center px-3 text-sm font-medium text-center text-white bg-[#e2e8f0] rounded-lg h-10">
                  🔥
                </div>
              </div>
              <div className="text-base lg:text-right text-gray-300 w-full">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
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
                <div className="mr-auto">Brand Design</div>
              </div>
              <div className="text-base text-left text-gray-300 w-full">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 w-full max-w-md mt-10">
              <div className="flex items-center gap-6 w-full">
                <div className="relative inline-flex items-center px-3 text-sm font-medium text-center text-white bg-[#e2e8f0] rounded-lg h-10">
                  🔥
                </div>
                <div className="mr-auto">Brand Design</div>
              </div>
              <div className="text-base text-left text-gray-300 w-full">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default About;
