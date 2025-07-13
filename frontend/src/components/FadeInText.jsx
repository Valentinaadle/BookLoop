import React, { useEffect, useRef } from 'react';

export default function FadeInText({ text, className = '', delay = 0.2 }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = 1;
      ref.current.style.transform = 'translateY(0)';
    }
  }, []);
  return (
    <span
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        opacity: 0,
        transform: 'translateY(20px)',
        transition: `opacity 0.7s ${delay}s cubic-bezier(0.4,0,0.2,1), transform 0.7s ${delay}s cubic-bezier(0.4,0,0.2,1)`
      }}
    >
      {text}
    </span>
  );
} 