'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface StarRatingProps {
  value?: number;
  onChange?: (value: number) => void;
}

export default function StarRating({ value = 0, onChange }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`h-5 w-5 cursor-pointer transition
            ${(hover ?? value) >= star ? 'text-gray-700' : 'text-gray-300'}
          `}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
        />
      ))}
    </div>
  );
}
