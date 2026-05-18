// app/(mainLayout)/contact/components/ContactDetails.tsx
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContactDetails({
  className = "",
}: {
  className?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-7xl px-6 mx-auto ${className}`}
    >
      <ContactCard
        icon={<PhoneIcon />}
        title="Call Us"
        detail="+91 82507 11212"
      />
      <ContactCard
        icon={<MailIcon />}
        title="Email Us"
        detail="sayan825071das@gmail.com"
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
      />
    </motion.div>
  );
}

function ContactCard({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: React.ReactNode;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl shadow-lg shadow-black/5 dark:shadow-white/[0.02] hover:shadow-xl hover:border-orange-500/30 transition-all duration-300"
    >
      <div className="w-12 h-12 flex items-center justify-center mb-4 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm border border-orange-100 dark:border-orange-500/20">
        <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
      </div>
      <div className="text-center">
        <h3 className="font-bold text-lg text-primary dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          {detail}
        </p>
      </div>
    </motion.div>
  );
}
