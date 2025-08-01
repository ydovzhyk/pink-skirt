'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import arrowUpIcon from '@/images/scrollToTop.png'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 450) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    };
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <button
      className={`fixed bottom-6 right-5 z-50 p-[1px] bg-[var(--accent-backround)] rounded-full shadow-lg transition-opacity duration-500 ease-in-out ${
        isVisible ? 'block' : 'hidden'
      }`}
      onClick={scrollToTop}
    >
      <div
        className={`absolute top-[-15px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-l-transparent border-r-transparent border-b-[10px] border-b-[#e83894] ${
          isVisible ? 'animate-blink' : ''
        }`}
      ></div>
      <Image
        src={arrowUpIcon}
        alt="Scroll to top"
        className="w-[50px] h-[50px] rounded-full"
      />
    </button>
  );
};

export default ScrollToTopButton;
