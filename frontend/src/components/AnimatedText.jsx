import React from 'react';
import '../Assets/css/loader.css';

export default function AnimatedText({ text, className = '', delay = 0.14 }) {
  return (
    <span className={className} style={{ display: 'inline-block' }}>
      {text.split('').map((char, i) => (
        <span
          className="loader-letter"
          key={i}
          style={{
            animationDelay: `${0.05 + i * delay}s`,
            color: 'inherit',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
} 