import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

const BentoGrid = () => {
  const fadeInProps = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1 }
  };

  return (
    <motion.section
      className="bg-white mt-[5%]"
      {...fadeInProps}
    >
      <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-full">
          <motion.div
            className="col-span-2 sm:col-span-1 md:col-span-2 bg-white-500 rounded-lg h-auto md:h-full flex flex-col border"
            {...fadeInProps}
          >
            <a href="" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pt-40 flex-grow">
              <h3 className="z-10 text-2xl font-medium text-black absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">CMS Univ</h3>
              <img src="/assets/cms-bg.jpg" alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 opacity-40 transition-transform duration-500 ease-in-out" />
              <p className="z-10 text-sm font-bold text-gray-700">Designed and developed a custom CMS to streamline content management for our institution, resulting in a 25% increase in efficiency (e.g., content creation speed, update turnaround time). </p>
              <br />
              <p className="z-10 text-sm font-bold text-gray-700">Identified the potential for the CMS to be transformed into a Software-as-a-Service (SaaS) solution, demonstrating strong entrepreneurial thinking and product vision.</p>
            </a>
          </motion.div>


          <motion.div
            className="col-span-2 sm:col-span-1 md:col-span-2 bg-whie-500 rounded"
            {...fadeInProps}
          >
            <a href="" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mb-4">
              <h3 className="z-10 text-2xl font-medium text-black absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">Health Access Kiosk</h3>
              <img src="/assets/kiosk-bg.png" alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 opacity-40 transition-transform duration-500 ease-in-out" />
              <p className="z-10 text-sm font-bold text-gray-700">Deployed a software application that helps rural communities in India manage medicine delivery orders, track pharmacy locations, attend emergency calls, and provide first aid assistance</p>
            </a>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
              <motion.a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                {...fadeInProps}
              >
                <h3 className="z-10 text-2xl font-medium text-black absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">DragForm</h3>
                <img src="/assets/dragform.png" alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 opacity-40 transition-transform duration-500 ease-in-out" />
                <p className="z-10 text-sm font-bold text-gray-700">Developed and deployed a web application that helps people build forms easily and track insights about filling and bouncing rates on that form.</p>
              </motion.a>
              <motion.a
                href=""
                className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40"
                {...fadeInProps}
              >
                <h3 className="z-10 text-2xl font-medium text-black absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">Qifi</h3>
                <img src="/assets/qifi.png" alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 opacity-40 transition-transform duration-500 ease-in-out" />
                <p className="z-10 text-sm font-bold text-gray-700">Developed mobile applications for yoga/mindfulness and interview preparation platforms, reaching 150+ users.</p>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="col-span-2 sm:col-span-1 md:col-span-1 bg-sky-50 h-auto md:h-full flex flex-col rounded-lg border"
            {...fadeInProps}
          >
            <a href="" className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow">
              <h3 className="z-10 text-2xl font-medium text-black absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">Sterp</h3>
              <img src="/assets/sterp.jpg" alt="" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 opacity-40 transition-transform duration-500 ease-in-out" />
              <p className="z-10 text-sm font-bold text-gray-700">
                Streamlined student, staff attendance, and timetable management processes by developing ERP systems, resulting in a 30% reduction in processing time.</p>
                <br />
                <p className="z-10 text-sm font-bold text-gray-700"> These systems provided real-time data access and automated many of the administrative tasks, leading to improved accuracy and efficiency in managing schedules and attendance records.
              </p>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default BentoGrid;
