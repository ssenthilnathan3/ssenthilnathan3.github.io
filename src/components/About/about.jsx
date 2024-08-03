import React from "react";
import Img from "/assets/about-me.jpg";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
// import "./about.css";

const About = () => {
  return (
    <div className="mt-10 grid grid-rows-1 lg:grid-rows-2 gap-3">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 w-full">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div>Brand Design</div>
              <div class="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <faInstagram />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div>Heading</div>
              <div>Icon</div>
            </div>
          </div>
          <div className="text-center">Photo</div>
          <div className="text-center">Section 2</div>
        </div>
      </div>
    </div>

  );
};

export default About;
