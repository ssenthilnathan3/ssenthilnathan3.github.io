import React, { useState } from 'react';

const AccordionItem = ({ title, content, imgSrc, imgAlt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item mb-4">
      <button
        className="accordion-header w-full bg-indigo-600 text-white py-4 px-6 rounded-lg shadow-lg flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <img src={imgSrc} alt={imgAlt} className="w-8 h-8 rounded-full border-2 mr-4" />
          <div>
            <h1 className="text-base">{title}</h1>
            <h2 className="text-xs text-opacity-50">Verified Graduate</h2>
          </div>
        </div>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div className="accordion-content px-6 py-4 bg-gray-100 rounded-lg shadow-md">
          <p className="text-lg font-semibold">{content.title}</p>
          <p className="text-sm text-opacity-70">{content.body}</p>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;
