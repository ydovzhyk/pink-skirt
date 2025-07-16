"use client";
// @flow strict
import { isValidEmail } from "@/utils/check-email";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Text from '../shared/text/text';

function ContactForm() {
  const [error, setError] = useState({ email: false, required: false });
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError({ ...error, required: false });
    }
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!userInput.email || !userInput.message || !userInput.name) {
      setError({ ...error, required: true });
      return;
    } else if (error.email) {
      return;
    } else {
      setError({ ...error, required: false });
    };

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      setIsLoading(true);
      await axios.post(`${origin}/api/contact`, userInput);

      toast.success("Message sent successfully!");
      setUserInput({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    };
  };

  return (
    <div>
      <Text
        type="normal"
        as="p"
        fontWeight="normal"
        className={'text-black mb-5'}
      >
        Contact with me
      </Text>
      <div className="max-w-3xl text-white rounded-md border border-[#464c6a] p-3 lg:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base">
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className={'text-[var(--text-title)]'}
              >
                Your Name:
              </Text>
            </label>
            <input
              className="bg-white w-full rounded-md border border-gray-400 outline-none ring-0 focus:border-[var(--accent)] focus:ring-[var(--accent)] transition-all duration-300 px-3 py-2 text-[var(--text-title)]"
              type="text"
              maxLength="100"
              required={true}
              onChange={e =>
                setUserInput({ ...userInput, name: e.target.value })
              }
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className={'text-[var(--text-title)]'}
              >
                Your Email:
              </Text>
            </label>
            <input
              className="bg-white w-full rounded-md border border-gray-400 outline-none ring-0 focus:border-[var(--accent)] focus:ring-[var(--accent)] transition-all duration-300 px-3 py-2 text-[var(--text-title)]"
              type="email"
              maxLength="100"
              required
              autoComplete="off"
              value={userInput.email}
              onChange={e =>
                setUserInput({ ...userInput, email: e.target.value })
              }
              onBlur={() => {
                checkRequired();
                setError({ ...error, email: !isValidEmail(userInput.email) });
              }}
            />

            {error.email && (
              <Text
                type="tiny"
                as="p"
                fontWeight="normal"
                className="text-red-400"
              >
                Please provide a valid email!
              </Text>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>
              <Text
                type="tiny"
                as="p"
                fontWeight="light"
                className={'text-[var(--text-title)]'}
              >
                Your Message:
              </Text>
            </label>
            <textarea
              className="bg-white w-full rounded-md border border-gray-400 outline-none ring-0 focus:border-[var(--accent)] focus:ring-[var(--accent)] transition-all duration-300 px-3 py-2 text-[var(--text-title)]"
              maxLength="500"
              name="message"
              required={true}
              onChange={e =>
                setUserInput({ ...userInput, message: e.target.value })
              }
              onBlur={checkRequired}
              rows="4"
              value={userInput.message}
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            {error.required && (
              <Text
                type="tiny"
                as="p"
                fontWeight="normal"
                className="text-red-400"
              >
                All fiels are required!
              </Text>
            )}
            <button
              className="group"
              role="button"
              onClick={handleSendMail}
              disabled={isLoading}
            >
              <div
                style={{ borderWidth: '0.5px' }}
                className="flex items-center gap-1 group-hover:gap-3 px-3 md:px-8 py-3 md:py-4 rounded-md border-gray-400 tracking-wider transition-all duration-300 ease-out bg-transparent group-hover:bg-[#F8F1F1] group-hover:border-[#F8F1F1] group-hover:shadow-md w-full btn-shine uppercase"
              >
                {isLoading ? (
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-[var(--text-title)]"
                  >
                    Sending Message...
                  </Text>
                ) : (
                  <Text
                    type="tiny"
                    as="span"
                    fontWeight="light"
                    className="text-[var(--text-title)]"
                  >
                    Send Message
                  </Text>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;