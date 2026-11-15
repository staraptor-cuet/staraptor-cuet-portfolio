'use client';

import React from 'react';

interface BirdLoaderProps {
  className?: string;
}

export default function BirdLoader({ className = '' }: BirdLoaderProps) {
  return (
    <div className={`loader-stage ${className}`}>
      <svg className="bird-loader" viewBox="0 0 1050 590" role="img" aria-label="Loading Staraptor">
        <defs>
          <mask id="bird-mask">
            <rect width="1050" height="590" fill="black" />
            <g fill="white">
              <path d="M 27 18 L 430 239 L 391 299 L 92 118 Z" />
              <path d="M 1023 16 L 605 232 L 651 298 L 943 134 Z" />
              <path d="M 120 169 L 171 258 L 466 424 L 390 299 Z" />
              <path d="M 921 169 L 870 258 L 574 424 L 652 299 Z" />
              <path d="M 203 289 L 382 407 L 470 480 L 350 335 Z" />
              <path d="M 840 289 L 658 407 L 570 480 L 690 335 Z" />
              <path
                d="
                  M 436 60
                  L 477 82
                  L 531 89
                  Q 580 100 598 143
                  Q 625 141 637 174
                  Q 611 163 589 177
                  Q 575 217 605 232
                  L 570 480
                  L 520 545
                  L 470 480
                  L 430 239
                  L 467 149
                  L 442 82
                  L 488 104
                  Z
                "
              />
            </g>
            <g fill="black">
              <path d="M 520 190 L 552 260 L 520 407 L 488 260 Z" />
            </g>
          </mask>
          <linearGradient id="bird-red" x1="0" y1="0" x2="0.72" y2="1">
            <stop offset="0" stopColor="#ff695e" />
            <stop offset="0.5" stopColor="#e6342d" />
            <stop offset="1" stopColor="#a90d14" />
          </linearGradient>
          <linearGradient id="sweep-red" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ff493f" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffc2bc" />
            <stop offset="1" stopColor="#ff493f" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="bird-mark" mask="url(#bird-mask)">
          <rect width="1050" height="590" fill="url(#bird-red)" opacity="0.38" />
          <rect className="bird-sweep" x="-330" width="260" height="590" fill="url(#sweep-red)" />
        </g>
      </svg>
    </div>
  );
}
