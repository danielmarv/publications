"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
          {/* Company Section */}
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Company</h2>
            <ul className="text-gray-500 font-medium dark:text-gray-400">
              {['About', 'Careers', 'Brand Center', 'Blog'].map((item) => (
                <li key={item} className="mb-4">
                  <Link href={`/${item.toLowerCase()}`} className="hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Help Center Section */}
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Help Center</h2>
            <ul className="text-gray-500 font-medium dark:text-gray-400">
              {['Discord Server', 'Twitter', 'Facebook', 'Contact Us'].map((item) => (
                <li key={item} className="mb-4">
                  <Link href={`/${item.replace(' ', '').toLowerCase()}`} className="hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Legal Section */}
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Legal</h2>
            <ul className="text-gray-500 font-medium dark:text-gray-400">
              {['Privacy Policy', 'Licensing', 'Terms & Conditions'].map((item) => (
                <li key={item} className="mb-4">
                  <Link href={`/${item.replace(/\s&\s/g, '-').toLowerCase()}`} className="hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Download Section */}
          <div>
            <h2 className="mb-6 text-sm font-semibold uppercase">Download</h2>
            <ul className="text-gray-500 font-medium dark:text-gray-400">
              {['iOS', 'Android', 'Windows', 'MacOS'].map((item) => (
                <li key={item} className="mb-4">
                  <Link href={`/${item.toLowerCase()}`} className="hover:underline">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`px-4 py-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} md:flex md:items-center md:justify-between`}>
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            © 2023 <Link href="https://flowbite.com">Flowbite™</Link>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            {['Facebook', 'Discord', 'Twitter', 'GitHub', 'Dribbble'].map((platform) => (
              <Link href={`/${platform.toLowerCase()}`} key={platform} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <span className="sr-only">{platform}</span>
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {/* Placeholder for Icons */}
                  <circle cx="10" cy="10" r="8" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-5 right-5 p-2 bg-blue-500 text-white rounded-full shadow-md"
        onClick={toggleDarkMode}
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
    </footer>
  );
};

export default Footer;
