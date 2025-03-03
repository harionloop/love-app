export interface SweetWord {
    text: string;
    language: 'english' | 'burmese';
  }
  
  export interface SweetSentence {
    text: string;
  }
  
  export interface Emoji {
    symbol: string;
  }
  
  export interface FloatingEmoji {
    id: number;
    emoji: string;
    left: string;
    delay: string;
    size: string;
    duration: string;
  }
  
  export interface Heart {
    id: number;
    x: number;
    y: number;
    size: string;
    color: string;
  }
  
  export interface Message {
    text: string;
    color: string;
    scale: number;
  }
  
  export interface ActiveSticker {
    id: number;
    src: string;
    x: number;
    y: number;
    rotation: number;
  }