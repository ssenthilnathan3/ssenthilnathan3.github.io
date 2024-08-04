import React from "react";
import data from "../../data/index.json";
import './testimonials.css';
import AccordionItem from "./AccordionItem";
export default function Testimonials() {
  return (
    <section className="testimonial--section" id="testimonial">
      <div class="hidden lg:grid lg:gap-4 2xl:gap-6 lg:grid-cols-4 2xl:row-span-2 2xl:pb-8 ml-2 pt-4 px-6">
        <div class="bg-indigo-600 lg:order-1 lg:row-span-1 2xl:row-span-1 lg:col-span-2 rounded-lg shadow-xl mb-5 lg:mb-0">
          <div class="mx-6 my-8 2xl:mx-10">
            <img class="w-8 md:w-9 lg:w-10 2xl:w-20 h-8 md:h-9 lg:h-10 2xl:h-20 rounded-full border-2 ml-1 lg:ml-3 2xl:ml-0 md:-mt-1 2xl:-mt-4" src="/assets/guru-prassannaa.png" />
            <h1 class="text-white text-xs md:text-base 2xl:text-2xl pl-12 lg:pl-16 2xl:pl-20 -mt-8 md:-mt-10 lg:-mt-11 2xl:-mt-20 2xl:mx-8">Guru Prasanna Rajsekar</h1>
            <h2 class="text-white text-opacity-50 text-xs md:text-base 2xl:text-2xl pl-12 lg:pl-16 2xl:pl-20 2xl:my-2 2xl:mx-8">CEO/UI/UX Designer</h2>
          </div>
          <div class="-mt-6 relative">
            <p class="text-white text-lg 2xl:text-4xl font-normal px-7 lg:px-9 2xl:pt-6 2xl:mx-2">Senthilnathan is one of the best developers that I had the pleasure of working with directly.His problem-solving skills and his unique way of visualizing a problem has always left me baffled. We tackled many problems together as a team, and his role as a teammate has always been highly valuable. I can proudly recommend this guy for all of his future endeavors.</p>
          </div>
        </div>

        <div class="bg-gray-900 lg:order-2 lg:row-span-1 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl pb-4 mb-5 lg:mb-0">
          <div class="mx-8 2xl:mx-10 my-10">
            <img class="w-8 md:w-9 2xl:w-20 h-8 md:h-9 2xl:h-20 rounded-full border-2 -ml-1 -mt-2 lg:-mt-4" src="/assets/user.webp" />
            <h1 class="text-white text-xs md:text-base 2xl:text-2xl pl-11 md:pl-12 2xl:pl-24 -mt-8 md:-mt-10 2xl:-mt-16">Prabhu S</h1>
            <h2 class="text-white text-xs md:text-base 2xl:text-2xl text-opacity-50 pl-11 md:pl-12 2xl:pl-24">Classmate</h2>
          </div>
          <div class="-mt-8 mx-1 lg:mx-2">
            <p class="text-white text-sm lg:text-sm 2xl:text-4xl font-medium pt-1 pb-2 px-6 2xl:px-8 lg:pl-5 lg:pr-8">Having worked closely with Senthilnathan during our academic projects, I can confidently say he is an outstanding classmate. His enthusiasm for learning and his willingness to help others make him a valuable asset in any group setting.</p>
          </div>
        </div>

        <div class="bg-primary-color-white lg:order-3 lg:row-span-2 2xl:row-span-1 lg:col-span-1 rounded-lg shadow-xl mb-5 lg:mb-0 2xl:mb-8">
          <div class="mx-8 my-10 lg:my-8">
            <img class="w-8 md:w-9 lg:w-11 2xl:w-20 h-8 md:h-9 lg:h-11 2xl:h-20 rounded-full border-2 -mt-3 -ml-1 lg:-ml-0" src="/assets/user.webp" />
            <h1 class="primary-color-blackish-blue text-xs md:text-base 2xl:text-2xl pl-11 md:pl-12 lg:pl-14 2xl:pl-24 -mt-8 md:-mt-10 lg:-mt-11 2xl:-mt-16">Arunkumar S</h1>
            <h2 class="primary-color-blackish-blue-opacity text-sm text-gray-500 md:text-base 2xl:text-2xl pl-11 md:pl-12 lg:pl-14 2xl:pl-24">Colleague</h2>
          </div>
          <div class="-mt-4 ml-5 mr-11">
            <p class="primary-color-blackish-blue text-base 2xl:text-4xl font-medium px-2 lg:px-3 -mt-6 lg:-mt-5 2xl:mt-12 2xl:pb-6">Senthilnathan has been an exceptional peer colleague throughout our time working together. His dedication to excellence and innovative approach to problem-solving has consistently impressed me.</p>
          </div>
        </div>

        <div class="bg-purple-800 lg:order-4 lg:row-span-2 2xl:row-span-1 col-span-2 rounded-lg shadow-xl mb-5 lg:mb-0 2xl:mb-8 lg:pb-14 2xl:pb-20">
          <div class="mx-8 my-8">
            <img class="w-8 md:w-9 lg:w-10 2xl:w-20 h-8 md:h-9 lg:h-10 2xl:h-20 rounded-full border-2 lg:-mt-3" src="/assets/user.webp" />
            <h1 class="text-white text-xs md:text-base 2xl:text-2xl pl-12 md:pl-14 2xl:pl-24 -mt-8 md:-mt-10 lg:-mt-11 2xl:-mt-16">Mentor</h1>
            <h2 class="primary-color-blackish-blue-opacity text-sm text-gray-500 md:text-base 2xl:text-2xl pl-11 md:pl-12 lg:pl-14 2xl:pl-24">&nbsp;</h2>

          </div>
          <div class="px-3 -mt-3 mb-5 lg:mb-0">
            <p class="text-white text-base 2xl:text-4xl font-medium px-4 -mt-3 lg:-mt-6 2xl:mt-8">Senthilnathan is an exceptional individual who demonstrates remarkable skill and dedication in all his endeavors. As a mentor, I have witnessed his growth and commitment to excellence firsthand. His analytical mindset, combined with his ability to communicate effectively, has made a significant impact on his projects and those around him</p>
          </div>
        </div>

        <div class="bg-primary-color-white lg:order-2 lg:row-span-4 lg:col-span-1 rounded-lg shadow-xl mb-5 lg:pb-4 2xl:h-screen">
          <div class="mx-8 my-8 lg:pl-1">
            <img class="w-8 md:w-9 lg:w-12 2xl:w-20 h-8 md:h-9 lg:h-12 2xl:h-20 rounded-full border-2 lg:-mt-4 -ml-1 lg:-ml-4" src="/assets/shamilsha.png" />
            <h1 class="primary-color-blackish-blue text-xs md:text-base 2xl:text-2xl pl-10 md:pl-12 2xl:pl-24 -mt-8 md:-mt-10 lg:-mt-12 2xl:-mt-16">Shamilsha</h1>
            <h2 class="primary-color-blackish-blue-opacity text-xs md:text-base 2xl:text-2xl pl-10 md:pl-12 2xl:pl-24">CEO</h2>
          </div>
          <div class="px-3 lg:px-5 lg:-mt-4 mb-5 lg:mb-0">
            <p class="primary-color-blackish-blue text-base 2xl:text-4xl font-medium px-4 lg:px-0 -mt-2 lg:-mt-0">I had the pleasure of working closely with Senthil, and I can confidently say that he is an outstanding teammate. His passion for his work is truly inspiring, and his problem-solving skills are exceptional. Senthil is highly talented in web development, app development, and various other areas. He consistently delivers high-quality results and contributes positively to the team. I highly recommend Senthil for any project or team where expertise, dedication, and passion are valued.</p>
          </div>
        </div>
      </div>
      <div className="lg:hidden w-full justify-center items-center">
      <AccordionItem
          title="Guru Prasanna Rajsekar"
          imgSrc="/assets/guru-prassannaa.png"
          imgAlt="Guru Prasanna Rajsekar"
          content={{
            title: "CEO/UI/UX Designer",
            body: "Senthilnathan is one of the best developers that I had the pleasure of working with directly. His problem-solving skills and his unique way of visualizing a problem has always left me baffled. We tackled many problems together as a team, and his role as a teammate has always been highly valuable. I can proudly recommend this guy for all of his future endeavors."
          }}
        />
        <AccordionItem
          title="Prabhu S"
          imgSrc="/assets/user.webp"
          imgAlt="Prabhu S"
          content={{
            title: "Classmate",
            body: "Having worked closely with Senthilnathan during our academic projects, I can confidently say he is an outstanding classmate. His enthusiasm for learning and his willingness to help others make him a valuable asset in any group setting."
          }}
        />
        <AccordionItem
          title="Arunkumar S"
          imgSrc="/assets/user.webp"
          imgAlt="Arunkumar S"
          content={{
            title: "Colleague",
            body: "Senthilnathan has been an exceptional peer colleague throughout our time working together. His dedication to excellence and innovative approach to problem-solving has consistently impressed me."
          }}
        />
        <AccordionItem
          title="Mentor"
          imgSrc="/assets/user.webp"
          imgAlt="Mentor"
          content={{
            title: "",
            body: "Senthilnathan is an exceptional individual who demonstrates remarkable skill and dedication in all his endeavors. As a mentor, I have witnessed his growth and commitment to excellence firsthand. His analytical mindset, combined with his ability to communicate effectively, has made a significant impact on his projects and those around him."
          }}
        />
        <AccordionItem
          title="Shamilsha"
          imgSrc="/assets/shamilsha.png"
          imgAlt="Shamilsha"
          content={{
            title: "CEO",
            body: "I had the pleasure of working closely with Senthil, and I can confidently say that he is an outstanding teammate. His passion for his work is truly inspiring, and his problem-solving skills are exceptional. Senthil is highly talented in web development, app development, and various other areas. He consistently delivers high-quality results and contributes positively to the team. I highly recommend Senthil for any project or team where expertise, dedication, and passion are valued."
          }}
        />
        
        
      </div>
    </section>
  );
}