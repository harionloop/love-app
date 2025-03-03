import React, { useEffect, useState, useRef } from "react";
import { sweetWords, sweetSentences, cuteEmojis, stickers } from "./data";
import "./LoveYouBabudi.css";

const LoveYouBabudi: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{ text: string; color: string; scale: number }>
  >([]);
  const [currentGradient, setCurrentGradient] = useState<number>(1);
  const [emojis, setEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number; size: number }>>([]);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [stickersList, setStickersList] = useState<Array<{ id: number; src: string; x: number; y: number }>>([]);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle background music
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = "/love-song.mp3";
        audioRef.current.play().catch((e) => console.error("Audio error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Generate new love message
  const generateNewMessage = () => {
    const randomSweetWord = sweetWords[Math.floor(Math.random() * sweetWords.length)];
    const randomSentence = sweetSentences[Math.floor(Math.random() * sweetSentences.length)];
    const randomEmoji = cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)];

    return {
      text: `${randomSentence} ${randomSweetWord} ${randomEmoji}`,
      color: `text-${["pink", "red", "purple", "blue", "indigo"][Math.floor(Math.random() * 5)]}-500`,
      scale: Math.random() * 0.5 + 1,
    };
  };

  // Track mouse movement for floating emojis
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newEmoji = {
        id: Date.now(),
        emoji: cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)],
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 1.5 + 1, // Random emoji sizes
      };
      setEmojis((prev) => [...prev.slice(-20), newEmoji]); // Keep emoji array optimized

      setTimeout(() => {
        setEmojis((prev) => prev.filter((emoji) => emoji.id !== newEmoji.id));
      }, 2500); // Increased duration before emoji disappears
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate background floating love emojis
  useEffect(() => {
    const interval = setInterval(() => {
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * window.innerHeight;
      const newEmoji = {
        id: Date.now(),
        emoji: cuteEmojis[Math.floor(Math.random() * cuteEmojis.length)],
        x: randomX,
        y: randomY,
        size: Math.random() * 5 + 1, // Random size variation
      };

      setEmojis((prev) => [...prev.slice(-30), newEmoji]); // Keep array optimized

      setTimeout(() => {
        setEmojis((prev) => prev.filter((emoji) => emoji.id !== newEmoji.id));
      }, 5000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle click interactions (hearts, stickers, confetti)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;

    setHearts((prev) => [...prev, { id: Date.now(), x, y }]);
    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
    setStickersList((prev) => [...prev, { id: Date.now(), src: randomSticker, x, y }]);

    if (Math.random() > 0.7) setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Cycle messages and backgrounds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessages([generateNewMessage()]);
      setCurrentGradient((prev) => (prev % 10) + 1);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className={`love-container bg-gradient-${currentGradient}`} onClick={handleClick}>
      <audio ref={audioRef} loop>
        <source src="/love-song.mp3" type="audio/mp3" />
      </audio>

      <div className="audio-controls">
        <button onClick={(e) => { e.stopPropagation(); toggleAudio(); }} className="audio-btn">
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>

      <div className="message-container">
        {messages.map((msg, index) => (
          <h1 key={index} className={`love-message ${msg.color}`} style={{ transform: `scale(${msg.scale})` }}>
            {msg.text}
          </h1>
        ))}
      </div>

      {/* Floating emojis following cursor */}
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          className="floating-emoji"
          style={{
            left: `${emoji.x}px`,
            top: `${emoji.y}px`,
            fontSize: `${emoji.size}rem`,
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {hearts.map((heart) => (
        <div key={heart.id} className="floating-heart" style={{ left: `${heart.x}px`, top: `${heart.y}px` }}>
          ❤️
        </div>
      ))}

      {stickersList.map((sticker) => (
        <img key={sticker.id} src={sticker.src} alt="sticker" className="sticker" style={{ left: `${sticker.x}px`, top: `${sticker.y}px` }} />
      ))}

      {showConfetti && <div className="confetti-container">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}%` }} />
        ))}
      </div>}

      <div className="click-hint">Click or move your mouse for magic! ✨💖</div>
    </div>
  );
};

export default LoveYouBabudi;