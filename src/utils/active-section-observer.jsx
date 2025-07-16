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
        rootMargin: '0px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    const sections = document.querySelectorAll('section[id], header, footer');
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [setActiveSection])

  return null
};
