import React, { useState } from 'react';
import { stickers } from './data';
import './StickerPanel.css';

interface StickerPanelProps {
  onSelectSticker: (stickerSrc: string) => void;
}

const StickerPanel: React.FC<StickerPanelProps> = ({ onSelectSticker }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const togglePanel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleStickerSelect = (e: React.MouseEvent, stickerSrc: string) => {
    e.stopPropagation();
    onSelectSticker(stickerSrc);
  };

  return (
    <div className={`sticker-panel ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
      <button className="sticker-toggle" onClick={togglePanel}>
        {isOpen ? '✖' : '💝'}
      </button>
      
      {isOpen && (
        <div className="sticker-grid">
          {stickers.map((sticker, index) => (
            <div 
              key={index} 
              className="sticker-item"
              onClick={(e) => handleStickerSelect(e, sticker)}
            >
              <img src={sticker} alt={`Sticker ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StickerPanel;