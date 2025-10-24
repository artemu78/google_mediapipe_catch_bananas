import React from 'react';
import { Fruit, FruitType } from '../types';

interface FruitItemProps {
  fruit: Fruit;
  isMirrored: boolean;
}

const getFruitEmoji = (type: FruitType): string => {
  switch (type) {
    case 'apple': return '🍎';
    case 'banana': return '🍌';
    case 'strawberry': return '🍓';
  }
};

const FruitItem: React.FC<FruitItemProps> = ({ fruit, isMirrored }) => {
  return (
    <div
      className="absolute text-5xl pointer-events-none z-10"
      style={{
        left: isMirrored ? `${(1 - fruit.x) * 100}%` : `${fruit.x * 100}%`,
        top: `${fruit.y * 100}%`,
        transform: 'translateX(-50%)',
        userSelect: 'none'
      }}
    >
      {getFruitEmoji(fruit.type)}
    </div>
  );
};

export default FruitItem;
