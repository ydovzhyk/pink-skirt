'use client'

import { useEffect } from 'react'

export default function ActiveSectionObserver({ setActiveSection }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
          }
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll('section[id], div[id], header, footer');
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [setActiveSection])

  return null
};
