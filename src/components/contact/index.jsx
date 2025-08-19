'use client';

import { useSelector } from 'react-redux';
import { getScreenType } from '@/redux/technical/technical-selectors';
import Text from '../shared/text/text';
import ContactForm from './contact-form';

const ContactSection = () => {
  const screenType = useSelector(getScreenType);

  return (
    <section id="contacts" className="container py-12 lg:py-16 relative">
      <div className="hidden lg:flex flex-col items-center lg:absolute top-[120px] -right-8">
        <Text
          type="regular"
          as="span"
          fontWeight="normal"
          className="text-[#e83894] uppercase rotate-90 p-2 px-5 bg-[var(--section-first)] border border-gray-300 rounded-md"
        >
          CONTACTS
        </Text>
        <span className="h-36 w-[1px] bg-gray-400"></span>
      </div>
      <Text
        type="normal"
        as="p"
        fontWeight="normal"
        className={`${screenType === 'isMobile' ? 'text-black mb-5 mt-[-10px]' : 'text-black mb-5'}`}
      >
        Contact with me
      </Text>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">
        {screenType !== 'isMobile' && <ContactForm />}
        <div className="w-full flex flex-row justify-center items-center">
          <div className="w-[100%] lg:w-[70%] flex flex-col gap-10">
            <Text
              type="regular"
              as="p"
              fontWeight="light"
              lineHeight="normal"
              className="text-[var(--text-title)] whitespace-pre-line"
            >
              Have questions or dream of creating something one-of-a-kind?
            </Text>
            <Text
              type="regular"
              as="p"
              fontWeight="light"
              lineHeight="normal"
              className="text-[var(--text-title)] whitespace-pre-line"
            >
              Contact me — I’m always excited to turn new design ideas into
              reality and craft garments that reflect your personal style and
              story.
            </Text>
          </div>
        </div>
        {screenType === 'isMobile' && <ContactForm />}
      </div>
    </section>
  );
}

export default ContactSection;
