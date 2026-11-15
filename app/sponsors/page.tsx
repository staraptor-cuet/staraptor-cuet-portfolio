'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useSiteContent } from '@/lib/useContent';
import { SponsorTier as SponsorTierType } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const SponsorTierComponent = ({ tier }: { tier: SponsorTierType }) => {
  const filledSponsors = tier.sponsors || [];
  const totalSlots = Math.max(tier.count, filledSponsors.length);
  const slots = Array(totalSlots).fill(0);

  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
    >
      <div className="bg-gradient-to-b from-[#D04741] to-[#6A2421] py-4 px-8 text-center rounded-sm mb-8 shadow-md">
        <h2 className="text-title-section !text-xl tracking-widest uppercase">
          {tier.title}
        </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {slots.map((_, i) => {
          const sponsor = filledSponsors[i];
          return (
            <motion.div
              key={i}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[calc(25%-1.5rem)] aspect-video"
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="h-full bg-[#1f1f1f] border-gray-sub/10 rounded-lg flex flex-col items-center justify-center p-4 sm:p-6 group hover:border-[#D04741]/50 hover:bg-[#252525] hover:shadow-[0_0_20px_rgba(208,71,65,0.15)] transition-all">
                {sponsor && sponsor.name ? (
                  <>
                    <div className="relative w-full h-24 sm:h-28 mb-4">
                      {sponsor.logo ? (
                        <Image
                          src={sponsor.logo}
                          alt={`${sponsor.name} logo`}
                          fill
                          className="object-contain"
                          unoptimized={sponsor.logo.startsWith('data:') || sponsor.logo.startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                          {sponsor.name}
                        </div>
                      )}
                    </div>

                    {sponsor.website ? (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-primary font-bold tracking-wide text-sm sm:text-base text-center transition-colors truncate max-w-full"
                      >
                        {sponsor.name}
                      </a>
                    ) : (
                      <p className="text-white font-bold tracking-wide text-sm sm:text-base text-center truncate max-w-full">
                        {sponsor.name}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-sub/50 font-bold tracking-widest uppercase text-xs sm:text-sm group-hover:text-primary transition-colors">
                    TBA
                  </p>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default function SponsorsPage() {
  const { content } = useSiteContent();
  const tiers = content?.sponsors || [];
  const contactEmail = content?.general?.contactEmail || 'staraptorcuet@gmail.com';
  const proposalUrl = content?.general?.proposalUrl || 'https://drive.google.com/drive/folders/1VGXoYQska6DDrVHstDyD-W608TmDV1BK?usp=sharing';

  return (
    <div className="bg-background min-h-screen py-16 md:py-24 text-gray-sub relative overflow-hidden">
      {/* MASCOT */}
      <div className="absolute
      left-[-3%] top-[15%]
      w-[55vw] max-w-[800px]
      h-auto aspect-[1/1]

      max-md:left-1/2
      max-md:top-[38%]
      max-md:-translate-x-1/2
      max-md:-translate-y-1/2
      max-md:w-[100vw]

      pointer-events-none z-0">
        <Image
          src="/images/we are staraptor bg.png"
          alt="Mascot background"
          fill
          className="object-contain object-left opacity-25 mix-blend-screen"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h1 className="text-title-main mb-6">Our Sponsors</h1>
          <p className="max-w-2xl mx-auto text-sm leading-relaxed text-gray-sub">
            The development of our cutting-edge VTOL UAV would not be possible without the generous support of our partners. We are actively seeking visionary organizations to join our mission to the METU VTOL Competition 2026.
          </p>
        </motion.div>

        {tiers.map((tier) => (
          <SponsorTierComponent key={tier.id} tier={tier} />
        ))}

        {/* CTA Section */}
        <motion.div
          className="mt-20 md:mt-32 text-center border-t border-gray-sub/10 pt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed">
            To become one of our sponsors, please contact us via email at:{' '}
            <a href={`mailto:${contactEmail}`} className="underline hover:text-primary transition-colors">
              {contactEmail}
            </a>
          </p>
          <Button asChild size="lg" className="rounded-lg font-bold gap-2">
            <a
              href={proposalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Download Proposal</span>
              <Download size={20} />
            </a>
          </Button>
        </motion.div>

      </div>
    </div>
  );
}
