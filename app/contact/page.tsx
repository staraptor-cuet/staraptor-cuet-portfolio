'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ContactPage() {
  const { content } = useSiteContent();
  const general = content?.general;
  const proposalUrl = general?.proposalUrl || "https://drive.google.com/drive/folders/1VGXoYQska6DDrVHstDyD-W608TmDV1BK?usp=sharing";
  const contactEmail = general?.contactEmail || "staraptorcuet@gmail.com";
  const facebookUrl = general?.socials?.facebook || "https://www.facebook.com/StaraptorCUET";
  const linkedinUrl = general?.socials?.linkedin || "https://www.linkedin.com/company/staraptor-cuet/";
  const instagramUrl = general?.socials?.instagram || "https://www.instagram.com/staraptor_cuet/";

  const contactMethods = [
    { icon: "facebook-box-fill.svg", text: "Facebook", href: facebookUrl },
    { icon: "instagram-fill.svg", text: "Instagram", href: instagramUrl },
    { icon: "linkedin-box-fill.svg", text: "LinkedIn", href: linkedinUrl },
    { icon: "phone-fill.svg", text: "01972723321", href: "tel:01972723321" },
    { icon: "mail-fill.svg", text: contactEmail, href: `mailto:${contactEmail}` },
  ].filter(item => item.href);

  return (
    <div className="bg-[#242424] min-h-screen py-24 text-gray-sub flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Badge variant="glow" className="mb-3 uppercase tracking-widest text-xs">
            Direct Communication
          </Badge>
          <h1 className="text-title-main mb-8 tracking-wider">
            Contact Us
          </h1>
        </motion.div>
        
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
          <Button asChild size="lg" className="rounded-md font-bold text-lg py-6 px-8 gap-3">
            <a
              href={proposalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Download Proposal</span>
              <Image src="/icons/download-2-fill.svg" alt="Download" width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
            </a>
          </Button>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {contactMethods.map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.href.startsWith('http') ? "_blank" : undefined}
              rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
              className="flex-1 min-w-[200px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Card className="bg-[#b03934] hover:bg-[#8e2d29] border-transparent text-white py-4 px-6 rounded-lg flex flex-row items-center justify-center gap-3 transition-colors shadow-lg">
                <Image src={`/icons/${item.icon}`} alt={item.text} width={20} height={20} style={{ filter: 'brightness(0) invert(1)' }} />
                <span className="font-bold">{item.text}</span>
              </Card>
            </motion.a>
          ))}
        </div>

      </div>
    </div>
  );
}
