import React, { useEffect, useState, useRef } from "react";
import { sweetWords, sweetSentences, cuteEmojis, stickers } from "./data";
import "./LoveYouBabudi.css";

const LoveYouBabudi: React.FC = () => {
  const [messages, setMessages] = useState<
    Array<{ text: string; color: string; scale: number }>
  >([]);
  const [currentGradient, setCurrentGradient] = useState<number>(1);
  const [emojis, setEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
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
        audioRef.current.src = "/love-song.mp3"; // Ensure the file exists in public/
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
      };
      setEmojis((prev) => [...prev, newEmoji]);

      // Remove old emojis after a while
      setTimeout(() => {
        setEmojis((prev) => prev.filter((emoji) => emoji.id !== newEmoji.id));
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle click interactions (hearts, stickers, confetti)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX;
    const y = e.clientY;

    // Add floating heart
    setHearts((prev) => [...prev, { id: Date.now(), x, y }]);

    // Add random sticker
    const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
    setStickersList((prev) => [...prev, { id: Date.now(), src: randomSticker, x, y }]);

    // Show confetti occasionally
    if (Math.random() > 0.7) setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // Cycle messages and backgrounds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessages([generateNewMessage()]);
      setCurrentGradient((prev) => (prev % 5) + 1);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className={`love-container bg-gradient-${currentGradient}`} onClick={handleClick}>
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="/love-song.mp3" type="audio/mp3" />
      </audio>

      {/* Audio Controls */}
      <div className="audio-controls">
        <button onClick={(e) => { e.stopPropagation(); toggleAudio(); }} className="audio-btn">
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>

      {/* Love messages */}
      <div className="message-container">
        {messages.map((msg, index) => (
          <h1 key={index} className={`love-message ${msg.color}`} style={{ transform: `scale(${msg.scale})` }}>
            {msg.text}
          </h1>
        ))}
      </div>

      {/* Floating emojis following cursor */}
      {emojis.map((emoji) => (
        <div key={emoji.id} className="floating-emoji" style={{ left: `${emoji.x}px`, top: `${emoji.y}px` }}>
          {emoji.emoji}
        </div>
      ))}

      {/* Floating hearts on click */}
      {hearts.map((heart) => (
        <div key={heart.id} className="floating-heart" style={{ left: `${heart.x}px`, top: `${heart.y}px` }}>
          ❤️
        </div>
      ))}

      {/* Stickers on click */}
      {stickersList.map((sticker) => (
        <img key={sticker.id} src={sticker.src} alt="sticker" className="sticker" style={{ left: `${sticker.x}px`, top: `${sticker.y}px` }} />
      ))}

      {/* Confetti */}
      {showConfetti && <div className="confetti-container">
        {/* Generate confetti pieces dynamically */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="confetti-piece" style={{ left: `${Math.random() * 100}%` }} />
        ))}
      </div>}

      {/* Click Hint */}
      <div className="click-hint">Click or move your mouse for magic! ✨💖</div>
    </div>
  );
};

export default LoveYouBabudi;