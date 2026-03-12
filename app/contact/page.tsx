'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const ContactMethod = ({ icon, text, index }: { icon: string, text: string, index: number }) => (
  <motion.a
    href="#"
    className="flex-1 min-w-[200px] bg-[#b03934] hover:bg-[#8e2d29] text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
  >
    <Image src={`/icons/${icon}`} alt={text} width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
    <span className="font-bold">{text}</span>
  </motion.a>
);

export default function ContactPage() {
  return (
    <div className="bg-[#242424] min-h-screen py-24 text-gray-sub flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        
        <motion.h1
          className="text-title-main mb-8 tracking-wider"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Contact Us
        </motion.h1>
        
        <motion.p
          className="max-w-4xl mx-auto text-lg md:text-xl font-medium leading-relaxed text-white mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          We value your interest and involvement in Staraptor. Whether you have questions, need support, or want to get more involved, we're here to help. Below are the ways you can reach out to us directly or stay connected through our updates.
        </motion.p>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.a
            href="https://drive.google.com/drive/folders/1VGXoYQska6DDrVHstDyD-W608TmDV1BK?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#D04741] hover:bg-[#b03934] text-white px-8 py-4 rounded-md font-bold text-lg transition-all shadow-lg hover:shadow-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Download Proposal</span>
            <Image src="/icons/download-2-fill.svg" alt="Download" width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
          </motion.a>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon: "facebook-box-fill.svg", text: "Facebook", href: "https://facebook.com/teamstaraptor" },
            { icon: "instagram-fill.svg", text: "Instagram", href: "https://instagram.com/teamstaraptor" },
            { icon: "linkedin-box-fill.svg", text: "LinkedIn", href: "https://linkedin.com/company/teamstaraptor" },
            { icon: "phone-fill.svg", text: "01972723321", href: "tel:01972723321" },
            { icon: "mail-fill.svg", text: "staraptorcuet@gmail.com", href: "mailto:staraptorcuet@gmail.com" },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.href.startsWith('http') ? "_blank" : undefined}
              rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
              className="flex-1 min-w-[200px] bg-[#b03934] hover:bg-[#8e2d29] text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Image src={`/icons/${item.icon}`} alt={item.text} width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="font-bold">{item.text}</span>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  );
}
