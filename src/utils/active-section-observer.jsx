'use client';

import { useEffect } from 'react';

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

    const observeSections = () => {
      const sections = document.querySelectorAll(
        'section[id], div[id], header, footer'
      );
      sections.forEach(section => observer.observe(section));
    };

    // 1. Спробуємо зразу
    observeSections();

    // 2. Якщо частина контенту довантажується — слухаємо зміни DOM
    const mutationObserver = new MutationObserver(() => {
      observeSections();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [setActiveSection]);

  return null;
}

