import { useEffect, useState } from "react";

export default function SplitFlap({ words, interval = 2200, className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const word = words[index];

  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-live="polite">
      {word.split("").map((char, i) => (
        <span
          key={`${index}-${i}`}
          className="flap-char inline-block"
          style={{ animationDelay: `${i * 25}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}