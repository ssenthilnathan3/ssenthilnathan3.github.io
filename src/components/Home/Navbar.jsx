import React, { useState } from 'react';
import { faHamburger, faCross } from '@fortawesome/free-solid-svg-icons';


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (id) => {
        setIsOpen(!isOpen);

        const elm = document.getElementById(id);
        if (elm) {
            elm.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col">
            <nav className="lg:flex hidden justify-around py-4 bg-white/10 backdrop-blur-md shadow-md w-3/4 fixed top-4 left-1/2 transform -translate-x-1/2 z-10 rounded-full">
                <a className="text-gray-600 cursor-pointer transition-colors duration-300 font-semibold text-blue-600" onClick={() => handleClick("home")}>hero ⚡️</a>
                <a className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-300" onClick={() => handleClick("about")}>more about me</a>
                <a className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-300" onClick={() => handleClick("testimonial")}>what people say about me</a>
                <a className="text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-300" onClick={() => window.location.href = '/#/finally'}>this'll be interesting 🥶</a>
            </nav>

            <nav className="lg:hidden fixed top-4 right-9 z-10">
                <button 
                    className={`p-3 bg-white/80 backdrop-blur-md shadow-md rounded-full text-sm ${isOpen ? 'w-full' : 'w-12'}`} 
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '❌' : '🍔'}
                </button>
                {isOpen && (
                    <div className={`absolute top-16 right-0 bg-white/80 backdrop-blur-md shadow-md rounded-2xl transition-all ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
                        <a className="block text-gray-600 hover:text-blue-500 cursor-pointer px-4 py-2" onClick={() => handleClick("home")}>hero ⚡️</a>
                        <a className="block text-gray-600 hover:text-blue-500 cursor-pointer px-4 py-2" onClick={() => handleClick("about")}>more about me</a>
                        <a className="block text-gray-600 hover:text-blue-500 cursor-pointer px-4 py-2" onClick={() => handleClick("testimonial")}>what people say about me</a>
                        <a className="block text-gray-600 hover:text-blue-500 cursor-pointer px-4 py-2" onClick={() => window.location.href = '/#/finally'}>this'll be interesting</a>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
