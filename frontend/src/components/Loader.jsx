import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../Assets/css/loader.css';

export default function Loader({ onFinish }) {
  const text = 'BookLoop';
  const [show, setShow] = useState(true);

  useEffect(() => {
    const delays = [0.05, 0.18, 0.31, 0.44, 0.57, 0.70, 0.83, 0.96];
    const lastDelay = delays[delays.length - 1];
    const animDuration = 0.6;
    const extra = 1.3;
    const total = lastDelay + animDuration + extra;
    const timer = setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, total * 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="loader-bg">
      <h1>
        {text.split('').map((char, i) => (
          <span className="loader-letter" key={i}>{char}</span>
        ))}
      </h1>
    </div>
  );
}