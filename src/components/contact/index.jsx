// @flow strict
import ContactForm from './contact-form';
import Text from '../shared/text/text';

function ContactSection() {
  return (
    <section id="contact" className="my-12 lg:my-16 relative mt-24 text-white">
      <div className="hidden lg:flex flex-col items-center absolute top-24 -right-8">
        <Text
          type="regular"
          as="span"
          fontWeight="normal"
          className="text-[#e83894] uppercase rotate-90 p-2 px-5 bg-[var(--sectionfirst)]"
        >
          CONTACTS
        </Text>
        <span className="h-36 w-[1px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <ContactForm />
        <div className="lg:w-3/4 ">
          <Text
            type="normal"
            as="p"
            fontWeight="light"
            lineHeight="normal"
            className="text-[var(--text-title)] text-center"
          >
            Have questions or dream of creating something one-of-a-kind?
          </Text>
          <Text
            type="normal"
            as="p"
            fontWeight="light"
            lineHeight="normal"
            className="text-[var(--text-title)] text-center"
          >
            Contact me — I’m always excited to turn new design ideas into
            reality and craft garments that reflect your personal style and
            story.
          </Text>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;