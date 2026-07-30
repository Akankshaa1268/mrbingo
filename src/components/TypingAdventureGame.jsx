import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recordActivity } from '../utils/activityHistory.js';

const QUESTION_TYPES = {
  MIRROR: 'mirror',
  SIMILAR: 'similar',
  CASE: 'case',
  WORD: 'word',
};

// Level 1: Mirror & Similar Letters + Simple Words
const LEVEL_1_LETTERS = [
  { type: QUESTION_TYPES.MIRROR, prompt: 'b', answer: 'b', instruction: 'Type the letter b' },
  { type: QUESTION_TYPES.MIRROR, prompt: 'd', answer: 'd', instruction: 'Type the letter d' },
  { type: QUESTION_TYPES.MIRROR, prompt: 'p', answer: 'p', instruction: 'Type the letter p' },
  { type: QUESTION_TYPES.MIRROR, prompt: 'q', answer: 'q', instruction: 'Type the letter q' },
  { type: QUESTION_TYPES.SIMILAR, prompt: 'm', answer: 'm', instruction: 'Type the letter m' },
  { type: QUESTION_TYPES.SIMILAR, prompt: 'w', answer: 'w', instruction: 'Type the letter w' },
  { type: QUESTION_TYPES.SIMILAR, prompt: 'u', answer: 'u', instruction: 'Type the letter u' },
  { type: QUESTION_TYPES.SIMILAR, prompt: 'n', answer: 'n', instruction: 'Type the letter n' },
  { type: QUESTION_TYPES.SIMILAR, prompt: 'a', answer: 'a', instruction: 'Type the letter a' },
  { type: QUESTION_TYPES.SIMILAR, prompt: 'o', answer: 'o', instruction: 'Type the letter o' },
];

const LEVEL_1_WORDS = [
  { type: QUESTION_TYPES.WORD, prompt: 'cat', answer: 'cat', instruction: 'Type the word cat' },
  { type: QUESTION_TYPES.WORD, prompt: 'dog', answer: 'dog', instruction: 'Type the word dog' },
  { type: QUESTION_TYPES.WORD, prompt: 'ball', answer: 'ball', instruction: 'Type the word ball' },
  { type: QUESTION_TYPES.WORD, prompt: 'tree', answer: 'tree', instruction: 'Type the word tree' },
  { type: QUESTION_TYPES.WORD, prompt: 'star', answer: 'star', instruction: 'Type the word star' },
  { type: QUESTION_TYPES.WORD, prompt: 'fish', answer: 'fish', instruction: 'Type the word fish' },
  { type: QUESTION_TYPES.WORD, prompt: 'bird', answer: 'bird', instruction: 'Type the word bird' },
];

// Level 2: Case Change + New Words
const LEVEL_2_LETTERS = [
  { type: QUESTION_TYPES.CASE, prompt: 'A', answer: 'a', instruction: 'Change A to small a' },
  { type: QUESTION_TYPES.CASE, prompt: 'G', answer: 'g', instruction: 'Change G to small g' },
  { type: QUESTION_TYPES.CASE, prompt: 'R', answer: 'r', instruction: 'Change R to small r' },
  { type: QUESTION_TYPES.CASE, prompt: 'T', answer: 't', instruction: 'Change T to small t' },
  { type: QUESTION_TYPES.CASE, prompt: 'H', answer: 'h', instruction: 'Change H to small h' },
  { type: QUESTION_TYPES.CASE, prompt: 'M', answer: 'm', instruction: 'Change M to small m' },
  { type: QUESTION_TYPES.CASE, prompt: 'Q', answer: 'q', instruction: 'Change Q to small q' },
  { type: QUESTION_TYPES.CASE, prompt: 'B', answer: 'b', instruction: 'Change B to small b' },
  { type: QUESTION_TYPES.CASE, prompt: 'D', answer: 'd', instruction: 'Change D to small d' },
  { type: QUESTION_TYPES.CASE, prompt: 'E', answer: 'e', instruction: 'Change E to small e' },
];

const LEVEL_2_WORDS = [
  { type: QUESTION_TYPES.WORD, prompt: 'kite', answer: 'kite', instruction: 'Type the word kite' },
  { type: QUESTION_TYPES.WORD, prompt: 'lion', answer: 'lion', instruction: 'Type the word lion' },
  { type: QUESTION_TYPES.WORD, prompt: 'frog', answer: 'frog', instruction: 'Type the word frog' },
  { type: QUESTION_TYPES.WORD, prompt: 'lamp', answer: 'lamp', instruction: 'Type the word lamp' },
  { type: QUESTION_TYPES.WORD, prompt: 'moon', answer: 'moon', instruction: 'Type the word moon' },
  { type: QUESTION_TYPES.WORD, prompt: 'sun', answer: 'sun', instruction: 'Type the word sun' },
  { type: QUESTION_TYPES.WORD, prompt: 'book', answer: 'book', instruction: 'Type the word book' },
  { type: QUESTION_TYPES.WORD, prompt: 'jump', answer: 'jump', instruction: 'Type the word jump' },
  { type: QUESTION_TYPES.WORD, prompt: 'milk', answer: 'milk', instruction: 'Type the word milk' },
];

export const TypingAdventureGame = ({ onBack, difficulty = "EASY" }) => {
  const [level, setLevel] = useState(difficulty === "HARD" ? 2 : 1);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const inputRef = useRef(null);
  const levelStartedAtRef = useRef(Date.now());
  const recordedResultRef = useRef(null);

  useEffect(() => {
    loadLevel(level);
  }, [level]);

  const loadLevel = (lvl) => {
    let tasks = [];
    let words = [];

    if (lvl === 1) {
      tasks = [...LEVEL_1_LETTERS].sort(() => Math.random() - 0.5).slice(0, 5);
      words = [...LEVEL_1_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
    } else {
      tasks = [...LEVEL_2_LETTERS].sort(() => Math.random() - 0.5).slice(0, 5);
      words = [...LEVEL_2_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
    }

    setQuestions([...tasks, ...words]);
    setCurrentIndex(0);
    setScore(0);
    setIsGameOver(false);
    setInputValue('');
    levelStartedAtRef.current = Date.now();
    recordedResultRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (!isGameOver || recordedResultRef.current === level) return;
    recordActivity({
      activity: `Typing Hero — ${difficulty[0] + difficulty.slice(1).toLowerCase()}`,
      skill: 'literacy',
      score,
      maxScore: 10,
      durationSeconds: Math.round((Date.now() - levelStartedAtRef.current) / 1000),
      details: { level },
    });
    recordedResultRef.current = level;
  }, [isGameOver, level, score]);

  const handleNextLevel = () => {
    setLevel(2);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!inputValue) return;

    const currentQ = questions[currentIndex];
    const isCorrect = inputValue === currentQ.answer;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    // Wait a moment before next question
    setTimeout(() => {
      setFeedback(null);
      setInputValue('');
      if (currentIndex < 9) {
        setCurrentIndex(currentIndex + 1);
        setTimeout(() => inputRef.current?.focus(), 50);
      } else {
        setIsGameOver(true);
      }
    }, 1500);
  };

  if (isGameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="celebration-burst game-shell flex min-h-[60vh] flex-col items-center justify-center text-center"
      >
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="mb-4 text-5xl font-bold text-bingo-navy">
          {level === 1 ? 'Level 1 Complete!' : 'Adventure Complete!'}
        </h2>
        <p className="text-2xl text-slate-600 mb-8">
          You got <span className="font-bold text-bingo-coral">{score}</span> out of <span className="font-bold text-bingo-blue">10</span> correct!
        </p>
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="toon-button-secondary"
          >
            Exit
          </button>

          {level === 1 ? (
            <button
              onClick={handleNextLevel}
              className="toon-button bg-bingo-coral text-white"
            >
              Next Level ➡
            </button>
          ) : (
            <button
              onClick={() => { setLevel(1); loadLevel(1); }} // Restart game
              className="toon-button bg-bingo-blue text-bingo-navy"
            >
              Play Again ↺
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div className="game-shell flex max-w-2xl flex-col items-center">
      {/* Header */}
      <div className="toon-card mb-8 flex w-full items-center justify-between px-5 py-4">
        <button onClick={onBack} className="font-extrabold text-bingo-navy hover:text-bingo-coral">
          ← Exit
        </button>
        <div className="flex gap-4 items-center">
          <span className="px-3 py-1 rounded-full bg-bingo-yellow/30 text-bingo-navy font-bold text-xs uppercase tracking-wider">
            Level {level}
          </span>
          <div className="text-slate-600 font-bold">
            Question {currentIndex + 1} / 10
          </div>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentIndex}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        className="toon-panel relative w-full overflow-hidden p-7 text-center sm:p-10"
      >
        {/* Progress bar background */}
        <div className="absolute top-0 left-0 h-2 bg-bingo-yellow transition-all duration-500" style={{ width: `${((currentIndex) / 10) * 100}%` }} />

        <h3 className="text-xl md:text-2xl text-slate-500 font-medium mb-6">
          {currentQ.instruction}
        </h3>

        <div className="mb-8">
          <span className="text-8xl md:text-9xl font-black text-slate-800 tracking-wider">
            {currentQ.prompt}
          </span>
        </div>

        {/* Input Area */}
        <div className="relative max-w-sm mx-auto">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="toon-input w-full px-6 py-4 text-center text-4xl font-bold"
            placeholder="..."
            autoComplete="off"
            autoFocus
            disabled={feedback !== null}
          />

          <button
            onClick={handleSubmit}
            disabled={!inputValue || feedback !== null}
            className={`mt-6 w-full py-4 rounded-xl font-bold text-lg transition-all ${!inputValue
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-bingo-blue text-white shadow-lg hover:bg-blue-600 hover:scale-[1.02]'
              }`}
          >
            Check Answer
          </button>
        </div>

        {/* Feedback Overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="celebration-burst absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="text-8xl mb-4">
                  {feedback === 'correct' ? '⭐' : '🤔'}
                </div>
                <h3 className={`text-3xl font-black mb-2 ${feedback === 'correct' ? 'text-green-500' : 'text-orange-400'}`}>
                  {feedback === 'correct' ? 'Awesome!' : 'Oops!'}
                </h3>
                {feedback === 'incorrect' && (
                  <p className="text-xl text-slate-600">
                    The answer was <span className="font-bold text-slate-800">{currentQ.answer}</span>
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};
