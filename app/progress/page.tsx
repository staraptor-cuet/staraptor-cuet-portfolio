'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSiteContent } from '@/lib/useContent';
import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProgressPage() {
  const { content } = useSiteContent();
  const progressList = content?.progress || [
    {
      id: 'default',
      title: 'Our Progress',
      date: '2026',
      description: 'More coming soon...',
      image: '/images/progress image.jpg',
    },
  ];

  return (
    <div className="bg-background min-h-screen py-24 text-gray-sub flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl px-4 flex flex-col items-center">
        <motion.h1
          className="text-4xl md:text-6xl font-orbitron font-bold text-[#d84e46] mb-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Our Progress
        </motion.h1>

        <div className="w-full space-y-12">
          {progressList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
            >
              <Card className="bg-[#1f1f1f] border-gray-sub/10 rounded-2xl overflow-hidden shadow-2xl group p-0">
                {item.image && (
                  <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110"
                      priority={idx === 0}
                      unoptimized={item.image.startsWith('data:') || item.image.startsWith('http')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] via-transparent to-transparent opacity-80" />
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  {item.date && (
                    <Badge variant="glow" className="mb-3 gap-1.5 px-3 py-1 text-xs">
                      <Calendar size={13} />
                      <span>{item.date}</span>
                    </Badge>
                  )}
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                    {item.title}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-white text-base sm:text-lg mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Continuous updates will be published as testing progresses toward METU VTOL 2026.
        </motion.p>
      </div>
    </div>
  );
}
