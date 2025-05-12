'use client';
import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

interface ConfettiProps {
  confettiComplete?: () => void;
}

export function ConfettiCustom({ confettiComplete }: ConfettiProps) {
  const { width, height } = useWindowSize();

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={400}
      tweenDuration={3000}
      gravity={0.4}
      onConfettiComplete={confettiComplete}
    />
  );
}
