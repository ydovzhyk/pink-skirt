'use client';

import { useEffect } from 'react';

export default function ActiveSectionObserver({ setActiveSection }) {
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const normalizedId = id === 'about-me-content' ? 'about-me' : id;
            setActiveSection(normalizedId);
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    const headingObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const normalizedId = id === 'about-me-content' ? 'about-me' : id;
            setActiveSection(normalizedId);
          }
        });
      },
      {
        threshold: 0.57,
      }
    );

    const observeElements = () => {
      const sections = document.querySelectorAll('section[id], div[id]');
      const headings = document.querySelectorAll('section[id] h2, div[id] h2');

      sections.forEach(section => sectionObserver.observe(section));
      headings.forEach(heading => headingObserver.observe(heading));
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      sectionObserver.disconnect();
      headingObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [setActiveSection]);

  return null;
}

