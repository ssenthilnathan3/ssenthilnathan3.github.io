import React from "react";
import data from "../../data/index.json";
import './testimonials.css';
export default function Testimonials() {
  return (
    <section className="testimonial--section" id="testimonial">
      <div className="portfolio--container-box">
        <div className="portfolio--container">
          <p className="sub--title">#whychoosme</p>
          <h2 className="sections--heading">Testimonials</h2>
        </div>
      </div>
      <div className="portfolio--section--container">
        {data.testimonial.map((item, index) => (
          <div key={index} className="testimonial--section--card">
            <p className="text-md">{item.description}</p>
            <div className="testimonial--section--card--author--detail">
              <img src={item.src} width="100px" height="100px" alt="Avatar" />
              <div>
                <p className="text-md testimonial--author--name">
                  {item.author_name}
                </p>
                <p className="text-md testimonial--author--designation">
                  {item.author_designation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}