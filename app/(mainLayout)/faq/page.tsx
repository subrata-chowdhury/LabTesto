// app/(mainLayout)/faq/page.tsx
"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiHelpCircle } from "react-icons/fi";

const faqData = [
  {
    title: "What types of diagnostic tests can I book on the platform?",
    description:
      "We offer a wide range of diagnostic tests, from basic tests like Complete Blood Count (CBC) to more advanced tests such as genetic testing, imaging, and specialized blood tests. You can search for tests directly on our platform and view available options.",
  },
  {
    title: "Do I need to create an account to book a test?",
    description:
      "No, you can search and view test details without logging in. However, to place an order, manage multiple patient profiles, or track your test results, you will need to sign up for an account.",
  },
  {
    title: "How do I choose the lab for my test?",
    description:
      "Once you select a test, you will be presented with a list of available labs for that particular test. You can choose any lab based on your preferences for location, pricing, or any other factors.",
  },
  {
    title: "Is the sample collection service available at my location?",
    description:
      "We offer home sample collection services in various locations. To check if we operate in your area, enter your address during the booking process, and the platform will show available options for home collection.",
  },
  {
    title: "Can I change my lab or test selection after booking?",
    description:
      "Once you place an order, the lab selection cannot be changed. However, if the order has not yet been processed or the sample collected, you can cancel your order and place a new one with your preferred lab or test.",
  },
  {
    title: "Can I cancel my test after placing an order?",
    description:
      "You can cancel your order at any time before the sample collection is initiated. If the collector has already been dispatched or arrived at your location, cancellations may not be possible.",
  },
  {
    title: "How do I pay for my tests?",
    description:
      "We offer multiple payment methods, including Cash on Delivery (COD), debit/credit cards, and online payment methods. You can choose your preferred payment method when confirming your order.",
  },
  {
    title: "Can I pay using Cash on Delivery (COD)?",
    description:
      "Yes, we offer the Cash on Delivery option. You can pay for your selected tests in cash when the sample collector arrives at your location for sample collection.",
  },
  {
    title: "How will I receive my test results?",
    description:
      "Test results are delivered securely through our platform. Once your tests are completed and verified by the lab, you will receive a notification, and you can view the results in your account dashboard.",
  },
  {
    title: "Is my personal and health information secure on this platform?",
    description:
      "Yes, we take data privacy and security seriously. We use encryption and other security measures to protect your personal and health-related information. Your data will never be shared with third parties without your consent, except as required for service fulfillment or by law.",
  },
  {
    title: "Can I leave a review for the lab or service?",
    description:
      "Yes, once your test procedure is complete, you can leave a review for the service, sample collection experience, or the lab. Your feedback helps us improve our services.",
  },
  {
    title: "How do I contact customer support?",
    description:
      "If you have any questions or need assistance, you can contact our customer support team through the contact form on the platform or via the provided support email.",
  },
  {
    title: "Can I store multiple patient profiles?",
    description:
      "Yes, you can store multiple patient details in your account to easily manage orders for family members or others. This makes it convenient to order tests for different individuals without re-entering details each time.",
  },
  {
    title: "How can I reset my password if I forget it?",
    description:
      "If you forget your password, simply click on the “Forgot Password” link on the login page. You will be asked to provide your registered email address, and we will send you instructions to reset your password.",
  },
  {
    title: "How do I track my test order status?",
    description:
      "You can view the status of your test order directly from your account dashboard. It will show updates such as sample collection, processing status, and when the results will be available.",
  },
  {
    title: "Can I provide patient details at the time of sample collection?",
    description:
      "Yes, during the sample collection, you can choose to provide the patient’s details directly to the collector. Alternatively, you can pre-fill this information when making the booking.",
  },
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 dark:bg-white/5 text-primary dark:text-white rounded-2xl mb-4">
            <FiHelpCircle size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about booking tests, sample collection,
            payments, and tracking results.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {faqData.map((faq, index) => (
            <DetailCardToggler
              key={index}
              index={index + 1}
              title={faq.title}
              description={faq.description}
            />
          ))}
        </div>

        {/* Footer Support Prompt */}
        <div className="mt-16 text-center bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;

function DetailCardToggler({
  index,
  title = "",
  description = "",
  className = "",
}: {
  index: number;
  title?: string;
  description?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className={`bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between px-6 py-5 cursor-pointer text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-semibold md:text-lg text-gray-900 dark:text-gray-100 pr-8">
          <span className="text-primary dark:text-gray-400 mr-2">{index}.</span>
          {title}
        </span>
        <div
          className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 mt-0.5 ${
            isOpen
              ? "bg-primary text-white dark:bg-white dark:text-black"
              : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"
          }`}
        >
          {isOpen ? <FiMinus size={18} /> : <FiPlus size={18} />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-1 text-gray-600 dark:text-gray-400 leading-relaxed sm:text-base text-sm border-t border-gray-50 dark:border-white/5">
              <div className="mt-2">{description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
