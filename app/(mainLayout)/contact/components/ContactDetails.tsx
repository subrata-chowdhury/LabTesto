"use client";

import { motion, Variants } from "framer-motion";
import { PhoneIcon } from "@/assets/reactIcon/contact/Phone";
import { MailIcon } from "@/assets/reactIcon/contact/Mail";
import { LocationIcon } from "@/assets/reactIcon/contact/Location";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ContactDetails({
  className = "",
  iconClassName = "",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-7xl px-6 mx-auto ${className}`}
    >
      <ContactCard
        icon={<PhoneIcon />}
        title="Call Us"
        detail="+91 82507 11212"
        iconClassName={iconClassName}
      />
      <ContactCard
        icon={<MailIcon />}
        title="Email Us"
        detail="sayan825071das@gmail.com"
        iconClassName={iconClassName}
      />
      <ContactCard
        icon={<LocationIcon />}
        title="Visit Us"
        detail={
          <>
            Kadasole more, Bankura, <br />
            Pin.: 722202 - West Bengal
          </>
        }
        iconClassName={iconClassName}
      />
    </motion.div>
  );
}

function ContactCard({
  icon,
  title,
  detail,
  iconClassName,
}: {
  icon: React.ReactNode;
  title: string;
  detail: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      className="flex flex-col items-center justify-center p-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-white/5 transition-all duration-300"
    >
      <div
        className={`w-14 h-14 flex items-center justify-center mb-5 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-full ${iconClassName}`}
      >
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          {detail}
        </p>
      </div>
    </motion.div>
  );
}
