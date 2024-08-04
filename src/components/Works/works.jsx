import data from '../../data/index.json';
import BentoGrid from './BentoGrid';
import './works.css'
import React from 'react';
import emailjs from 'emailjs-com';


const Header = () => {
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 sm:py-24 lg:px-8 mt-5">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            yay 🙌 you've read all that! now that you have known everything about me 🎉 !!!!!
          </h2>
        </div>
      </div>
    </section>
  )
}


function Footer() {
  const handleSubmit = (event) => {
    event.preventDefault();

    // Ensure the form element is correctly referenced
    const form = event.target;

    emailjs.sendForm('service_e6z00m8', 'template_323d73g', form, '8yDovj_5K5Dq2t4SY')
      .then((result) => {
        console.log('Success:', result.text);
        alert('Email sent successfully!');
      })
      .catch((error) => {
        console.error('Error:', error.text);
        alert('Failed to send email. Please try again.');
      });
  };

  return (
    <footer className="bg-black lg:h-screen text-white py-8 mx-[6%] my-[4%] rounded-lg flex flex-col items-center justify-center" id="footer">
      <div className="max-w-screen-xl text-center mb-8">
        <p className="lg:text-7xl text-xl font-bold">Ready to make the call??</p>
      </div>
      <section className="flex items-center justify-center lg:w-full w-[90%]">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md sm:text-center">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                <div className="relative w-full">
                  <label htmlFor="email" className="hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Just say hi (w/ email tho)!</label>
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    🔥
                  </div>
                  <input
                    name="message"
                    className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Just say hi (w/ email tho)"
                    type="email"
                    id="email"
                    required
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="py-3 px-5 w-auto text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Book
                  </button>
                </div>
              </div>
              <div className="mx-auto max-w-screen-sm text-sm text-left text-gray-500 newsletter-form-footer dark:text-gray-300">
                Yay!! This is gonna be lit and cool! Be ready for the ride 😎
              </div>
            </form>
          </div>
        </div>
      </section>
    </footer>
  );
}


export default function Works() {
  return (
    <div>
      <BentoGrid />
      <Header />
      <Footer />
    </div>
  );
}