import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = ['b', 'd', 'p', 'q', 'm', 'w'];

// Child-friendly distinctive colors
const COLORS = [
    'bg-red-400', 'bg-orange-400', 'bg-amber-400',
    'bg-yellow-400', 'bg-lime-400', 'bg-green-400',
    'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400',
    'bg-sky-400', 'bg-blue-400', 'bg-indigo-400',
    'bg-violet-400', 'bg-purple-400', 'bg-fuchsia-400', 'bg-pink-400', 'bg-rose-400'
];

export const LetterMatchingGame = ({ onBack }) => {
    const [cards, setCards] = useState([]);
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [isGameComplete, setIsGameComplete] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        // Generate pairs of letters
        let gameCards = [];
        LETTERS.forEach(letter => {
            gameCards.push({ content: letter });
            gameCards.push({ content: letter });
        });

        // Shuffle cards for position
        gameCards.sort(() => Math.random() - 0.5);

        // Shuffle colors and assign UNIQUE colors to each card instance
        // This ensures matching is based on SHAPE, not colour.
        const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);

        gameCards = gameCards.map((card, index) => ({
            ...card,
            color: shuffledColors[index % shuffledColors.length],
            uniqueId: index,
            isMatched: false,
        }));

        setCards(gameCards);
        setSelectedIndices([]);
        setMatchedPairs([]);
        setAttempts(0);
        setIsGameComplete(false);
        setIsProcessing(false);
    };

    const handleCardClick = (index) => {
        if (
            selectedIndices.includes(index) ||
            matchedPairs.includes(cards[index].content) ||
            isProcessing ||
            isGameComplete
        ) {
            return;
        }

        const newSelected = [...selectedIndices, index];
        setSelectedIndices(newSelected);

        if (newSelected.length === 2) {
            setIsProcessing(true);
            setAttempts((prev) => prev + 1);
            checkForMatch(newSelected);
        }
    };

    const checkForMatch = ([firstIndex, secondIndex]) => {
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];

        if (firstCard.content === secondCard.content) {
            // Match found
            setMatchedPairs((prev) => [...prev, firstCard.content]);
            setSelectedIndices([]);
            setIsProcessing(false);

            // Check if game is complete
            // cards.length / 2 is total pairs
            if (matchedPairs.length + 1 === LETTERS.length) {
                setTimeout(() => setIsGameComplete(true), 500);
            }
        } else {
            // No match - Wait and unselect
            setTimeout(() => {
                setSelectedIndices([]);
                setIsProcessing(false);
            }, 1000);
        }
    };

    const isCardSelected = (index) => {
        return selectedIndices.includes(index);
    };

    const isCardMatched = (index) => {
        return matchedPairs.includes(cards[index].content);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-8 bg-white/80 p-4 rounded-3xl shadow-sm border border-white/50 backdrop-blur-sm">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                    ← Back
                </button>
                <div className="flex gap-6 text-slate-800 font-bold text-lg md:text-xl">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Attempts</span>
                        <span className="text-2xl text-indigo-600">{attempts}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Matches</span>
                        <span className="text-2xl text-emerald-500">{matchedPairs.length} / {LETTERS.length}</span>
                    </div>
                </div>
            </div>

            {/* Instructional Text */}
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Shape Detective! 🕵️</h3>
                <p className="text-slate-600 font-medium text-lg max-w-lg mx-auto leading-snug">
                    Tap the letters that look the same. <br />
                    <span className="text-base font-normal opacity-80 block mt-1">don't let the colors trick you! Watch out for <b>b</b> vs <b>d</b>.</span>
                </p>
            </div>

            {/* Game Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full justify-items-center">
                {cards.map((card, index) => (
                    <Card
                        key={card.uniqueId}
                        card={card}
                        isSelected={isCardSelected(index)}
                        isMatched={isCardMatched(index)}
                        onClick={() => handleCardClick(index)}
                    />
                ))}
            </div>

            {/* Game Over Modal */}
            <AnimatePresence>
                {isGameComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center border-4 border-yellow-400"
                        >
                            <div className="text-6xl mb-4">🌟</div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Super Detective!</h2>
                            <p className="text-slate-600 mb-6">You found all the matching shapes!</p>

                            <div className="bg-slate-50 rounded-2xl p-4 mb-8 grid grid-cols-3 gap-2">
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 font-semibold">Total</span>
                                    <span className="text-2xl font-bold text-indigo-600">{attempts}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 font-semibold">Correct</span>
                                    <span className="text-2xl font-bold text-emerald-500">{matchedPairs.length}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 font-semibold">Mistakes</span>
                                    <span className="text-2xl font-bold text-rose-500">{attempts - matchedPairs.length}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={onBack}
                                    className="px-6 py-3 rounded-2xl font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 transition-colors"
                                >
                                    Exit
                                </button>
                                <button
                                    onClick={initializeGame}
                                    className="px-6 py-3 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
                                >
                                    Play Again ↺
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Extracted Card Component
const Card = ({ card, isSelected, isMatched, onClick }) => {
    // Variants for animation
    const variants = {
        idle: { scale: 1, rotate: 0 },
        selected: { scale: 1.1, rotate: [0, -2, 2, 0] }, // wiggle when selected
        matched: { scale: 0.9, opacity: 0.4 } // fade out when matched
    };

    return (
        <motion.div
            className={`relative w-20 h-28 sm:w-24 sm:h-32 cursor-pointer select-none`}
            onClick={onClick}
            variants={variants}
            initial="idle"
            animate={isMatched ? "matched" : isSelected ? "selected" : "idle"}
            whileHover={!isMatched && !isSelected ? { scale: 1.05 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div
                className={`
                    w-full h-full rounded-2xl shadow-md flex items-center justify-center border-4 
                    ${isSelected ? 'border-indigo-600 ring-4 ring-indigo-200' : 'border-white'} 
                    ${card.color}
                    transition-all duration-300
                `}
            >
                {/* 
                    Using a serif or specific font can help, but standard sans-serif is often ambiguous.
                    We use a large font size. 
                */}
                <span className="text-6xl font-black text-white drop-shadow-md pb-2 font-mono">
                    {card.content}
                </span>
            </div>

            {/* Orientation Line: helps identify bottom of card (cardinality) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-black/10 rounded-full" />
        </motion.div>
    );
};
