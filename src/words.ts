import dictionary from 'an-array-of-english-words';

export const WORDS_5 = [
  "APPLE", "BEACH", "BRAIN", "BREAD", "BRUSH", "CHAIR", "CHEST", 
  "CHORD", "CLICK", "CLOCK", "CLOUD", "DANCE", "DIARY", "DRINK", 
  "EARTH", "FLUTE", "FRUIT", "GHOST", "GRAPE", "GREEN", "HAPPY", 
  "HEART", "HOUSE", "JUICE", "LIGHT", "MONEY", "MUSIC", "NIGHT", 
  "NOISE", "OCEAN", "PAPER", "PEACE", "PIZZA", "PLANT", "RIVER", 
  "ROAST", "SHEEP", "SHIRT", "SIGHT", "SKILL", "SLEEP", "SMILE", 
  "SNAKE", "SPACE", "SPOON", "STONE", "STORY", "STUDY", "SUGAR", 
  "TABLE", "TASTE", "THING", "TIGER", "TRACK", "TRAIN", "TRUST", 
  "TRUTH", "UNCLE", "VOICE", "WATER", "WHEEL", "WHITE", "WORLD", 
  "YOUTH", "ZEBRA"
];

const VALID_WORDS_SET = new Set<string>();

// Add our explicit 5-letter words to the valid set
WORDS_5.forEach(word => VALID_WORDS_SET.add(word));

// Add all 5-letter words from the dictionary
if (Array.isArray(dictionary)) {
  dictionary.forEach(word => {
    if (typeof word === 'string' && word.length === 5) {
      VALID_WORDS_SET.add(word.toUpperCase());
    }
  });
}

export function getRandomWord(): string {
  return WORDS_5[Math.floor(Math.random() * WORDS_5.length)].toUpperCase();
}

export function isValidWord(word: string): boolean {
  return VALID_WORDS_SET.has(word.toUpperCase());
}
