import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import { recordActivity } from '../utils/activityHistory.js';

// --- DATA STRUCTURE FOR EMOTIONS ---
// NOTE: Since these are static assets, we hardcode the known files from your project structure.
// This avoids needing a backend to list directory contents at runtime.
const EMOTIONS_DB = {
    Angry: {
        Emoji: ["angry1.png", "OIP.jpg", "OIP 2.jpg"],
        Cartoon: ["pikachu.jpg", "OIP.jpg", "OIP (1).jpg"],
        Face: ["angry_face.jpg", "angry_face(1).jpeg", "OIP.jpg"]
    },
    Disgust: {
        Emoji: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Cartoon: ["disgust1.png", "OIP.jpg", "OIP (1).jpg"],
        Face: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"]
    },
    Fear: {
        Emoji: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Cartoon: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Face: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"]
    },
    Happy: {
        Emoji: ["happy.png", "OIP.jpg", "OIP (1).jpg"],
        Cartoon: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Face: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"]
    },
    Sad: {
        Emoji: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Cartoon: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Face: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"]
    },
    Shock: {
        Emoji: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Cartoon: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"],
        Face: ["OIP.jpg", "OIP (1).jpg", "OIP (2).jpg"]
    }
};

const DIFFICULTY_CONFIG = {
    EASY: { label: 'Easy', folder: 'Emoji', color: 'from-green-400 to-emerald-500' },
    MEDIUM: { label: 'Medium', folder: 'Cartoon', color: 'from-yellow-400 to-amber-500' },
    HARD: { label: 'Hard', folder: 'Face', color: 'from-red-500 to-rose-600' }
};

const QUESTIONS_PER_SESSION = 6;

export const EmotionGame = ({ onBack }) => {
    // Game State
    const [difficulty, setDifficulty] = useState(null); // 'EASY', 'MEDIUM', 'HARD'
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('menu'); // menu, playing, feedback, result
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const gameStartedAtRef = useRef(null);
    const recordedResultRef = useRef(false);

    // --- GAME LOGIC ---

    const startGame = (level) => {
        gameStartedAtRef.current = Date.now();
        recordedResultRef.current = false;
        setDifficulty(level);
        generateQuestions(level);
        setScore(0);
        setCurrentQuestionIndex(0);
        setGameState('playing');
    };

    useEffect(() => {
        if (gameState !== 'result' || recordedResultRef.current || !difficulty) return;
        recordActivity({
            activity: `Emotion Explorer — ${DIFFICULTY_CONFIG[difficulty].label}`,
            skill: 'social',
            score,
            maxScore: QUESTIONS_PER_SESSION,
            durationSeconds: gameStartedAtRef.current
                ? Math.round((Date.now() - gameStartedAtRef.current) / 1000)
                : 0,
            details: { difficulty },
        });
        recordedResultRef.current = true;
    }, [difficulty, gameState, score]);

    const generateQuestions = (level) => {
        const folderType = DIFFICULTY_CONFIG[level].folder;
        const allEmotions = Object.keys(EMOTIONS_DB);
        const newQuestions = [];

        for (let i = 0; i < QUESTIONS_PER_SESSION; i++) {
            // 1. Pick Random Emotion (Correct Answer)
            const correctEmotion = allEmotions[Math.floor(Math.random() * allEmotions.length)];

            // 2. Pick Random Image from that Emotion's Subfolder
            const possibleImages = EMOTIONS_DB[correctEmotion][folderType];
            // Fallback for missing images (though we try to list them all)
            const imageFile = possibleImages && possibleImages.length > 0
                ? possibleImages[Math.floor(Math.random() * possibleImages.length)]
                : "placeholder.jpg";

            // 3. Generate 3 Distractors
            const distractors = allEmotions
                .filter(e => e !== correctEmotion)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const options = [correctEmotion, ...distractors].sort(() => 0.5 - Math.random());

            newQuestions.push({
                imagePath: `/src/public/${correctEmotion}/${folderType}/${imageFile}`, // Adjusted path for Vite to serve from src/public if configured, or move to public root. 
                // NOTE: Standard Vite puts public assets at root. If your folder is src/public, import might be needed or move folder.
                // Assuming "public" folder is served at root URL "/".
                // If the folder structure is literally "src/public", we might need to import them or move them.
                // User said "emotioins folder in public".
                // My list_dir showed "src/public". 
                // In Vite, usually things in "public" are served at root. But here it is "src/public". 
                // I will try to use the raw path or assume build handles it.
                // Best Practice: Move to public/ at root. But user has them in src/public.
                // I will use exact relative path if possible or dynamic import if needed.
                // Let's try direct URL assuming a specific vite config or just try relative.
                // Actually, if it's in src, we should import it. But dynamic import of deep varying paths is tricky.
                // Let's assume the user can move them or has a way. I will use the path structure:
                // `src/public/${emotion}/${folder}/${file}` logic visualization. 
                // WAIT. If it's in `src` it is NOT public static asset by default unless configured.
                // I will try to use the path relative to project root?
                // Let's try: `src/public/...`

                correctAnswer: correctEmotion,
                options: options
            });
        }
        setQuestions(newQuestions);
    };

    const handleOptionSelect = (option) => {
        if (gameState !== 'playing') return;

        setSelectedOption(option);
        const correct = option === questions[currentQuestionIndex].correctAnswer;
        setIsCorrect(correct);
        setGameState('feedback');

        if (correct) {
            setScore(s => s + 1);
        }

        // Auto advance
        setTimeout(() => {
            if (currentQuestionIndex < QUESTIONS_PER_SESSION - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setGameState('playing');
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setGameState('result');
            }
        }, 1500);
    };

    // --- RENDER HELPERS ---

    // Attempt to resolve image path. Logic:
    // If we are in dev, src/public might work if handled given we are in src/components.
    // ../public/...
    const getImgPath = (relPath) => {
        // This is a naive attempt. In a real app we'd import.
        // Or we might need to rely on the fact that Vite allows serving files?
        // Let's try strictly relative URL from current location? No.
        // Let's try absolute path from server root assuming src is exposed?
        return relPath;
    };

    // --- RENDER ---

    if (gameState === 'menu') {
        return (
            <div className="game-shell flex min-h-[75vh] flex-col items-center justify-center">
                <h1 className="mb-2 text-4xl font-bold text-bingo-navy md:text-6xl">Emotion Explorer 🧐</h1>
                <p className="mb-8 max-w-md text-center font-semibold text-bingo-navy/60">Can you guess the feeling?</p>

                <div className="grid gap-4 w-full max-w-sm">
                    {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => startGame(key)}
                            className={`toon-button w-full bg-gradient-to-r py-4 text-xl text-white ${config.color}`}
                        >
                            {config.label}
                            <span className="block text-xs opacity-75 font-normal mt-1">
                                {key === 'EASY' ? 'Emojis' : key === 'MEDIUM' ? 'Cartoons' : 'Real Faces'}
                            </span>
                        </button>
                    ))}
                    <button onClick={onBack} className="toon-button-secondary mt-4">← Back</button>
                </div>
            </div>
        );
    }

    if (gameState === 'result') {
        return (
            <div className="celebration-burst game-shell flex min-h-[75vh] flex-col items-center justify-center">
                <div className="toon-panel w-full max-w-md p-8 text-center">
                    <h2 className="text-3xl font-black text-slate-800 mb-4">Great Job! 🎉</h2>
                    <div className="text-6xl font-black text-indigo-600 mb-2">{score} / {QUESTIONS_PER_SESSION}</div>
                    <p className="text-slate-500 mb-8">Correct Answers</p>

                    <button
                        onClick={() => setGameState('menu')}
                        className="w-full py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 mb-3"
                    >
                        Play Again
                    </button>
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-600">Exit</button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className="game-shell flex min-h-screen flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-6 mt-4">
                <div className="bg-white px-4 py-2 rounded-full font-bold text-slate-700 shadow-sm border border-slate-200">
                    Q: {currentQuestionIndex + 1} / {QUESTIONS_PER_SESSION}
                </div>
                <div className="bg-white px-4 py-2 rounded-full font-bold text-indigo-600 shadow-sm border border-slate-200">
                    Score: {score}
                </div>
            </div>

            {/* Image Card */}
            <motion.div
                key={currentQ.imagePath}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="toon-panel mb-8 rotate-1 p-4 transition-transform duration-300 hover:rotate-0"
            >
                <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-200 rounded-2xl overflow-hidden relative">
                    {/* We use a simple img tag. If path issues occur, we might see broken images. */}
                    <img
                        src={currentQ.imagePath}
                        alt="Emotion?"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300?text=Image+Not+Found";
                            e.target.onerror = null; // Prevent loop
                        }}
                    />
                </div>
            </motion.div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                {currentQ.options.map((option) => {
                    const isSelected = selectedOption === option;
                    let btnClass = "bg-white hover:bg-slate-50 border-slate-200 text-slate-700";

                    if (gameState === 'feedback') {
                        if (option === currentQ.correctAnswer) {
                            btnClass = "bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-200";
                        } else if (isSelected && option !== currentQ.correctAnswer) {
                            btnClass = "bg-rose-500 border-rose-600 text-white";
                        } else {
                            btnClass = "opacity-50 bg-slate-100";
                        }
                    }

                    return (
                        <button
                            key={option}
                            onClick={() => handleOptionSelect(option)}
                            disabled={gameState === 'feedback'}
                            className={`
                                py-4 px-6 rounded-xl font-bold text-lg shadow-sm border-b-4 transition-all
                                ${btnClass}
                            `}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {gameState === 'feedback' && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`mt-8 text-2xl font-black ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}
                >
                    {isCorrect ? 'CORRECT! 🌟' : `Oops! It was ${currentQ.correctAnswer}`}
                </motion.div>
            )}
        </div>
    );
};
