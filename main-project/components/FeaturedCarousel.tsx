'use client';

import { useState } from 'react';
import { TransferGuide } from '@/lib/data';
import GuideCard from './cards/GuideCard'; 
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  guides: TransferGuide[];
}

export default function FeaturedCarousel({ guides }: Props) {
  // Paginacija
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 4;

  const nextBatch = () => {
    if (startIndex + itemsPerPage < guides.length) {
      setStartIndex(startIndex + itemsPerPage);
      setDirection(1);
    }
  };

  const prevBatch = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
      setDirection(-1);
    }
  };

  const visibleGuides = guides.slice(startIndex, startIndex + itemsPerPage);
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + itemsPerPage >= guides.length;

  // Animacija za desktop
  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Featured Guides
          </h2>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Check out some of the favourite guides from our community and find inspiration for your next trip!
          </p>
        </div>

        <div className="hidden md:flex gap-2">
          <button
            onClick={prevBatch}
            disabled={isPrevDisabled}
            className={`p-2 rounded-full border transition-all ${
              isPrevDisabled
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextBatch}
            disabled={isNextDisabled}
            className={`p-2 rounded-full border transition-all ${
              isNextDisabled
                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 text-gray-700 hover:bg-white hover:shadow-md hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="md:hidden flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory -mx-4 px-4 scrollbar-hide">
        {guides.map((guide) => (
          <div 
            key={guide.id} 
            className="min-w-[85vw] sm:min-w-[300px] snap-center" // Kartica zauzima 85% širine ekrana
          >
            <GuideCard guide={guide} />
          </div>
        ))}
      </div>
  
      <div className="hidden md:block overflow-hidden min-h-[300px]"> 
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={startIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {visibleGuides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}