import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recordActivity } from '../utils/activityHistory.js';

const GAME_DURATION_SEC = 60;

const DIFFICULTY_CONFIG = {
    LEVEL_1: { level: 1, lanes: 2, obstaclesPerWave: 1, label: 'Biscuit Boulevard', color: 'from-green-400 to-emerald-500', speed: 0.22, spawnRate: 4800, carScale: 0.52 },
    LEVEL_2: { level: 2, lanes: 2, obstaclesPerWave: 1, label: 'Jellybean Junction', color: 'from-cyan-400 to-blue-500', speed: 0.26, spawnRate: 4400, carScale: 0.5 },
    LEVEL_3: { level: 3, lanes: 2, obstaclesPerWave: 1, label: 'Lollipop Lane', color: 'from-pink-400 to-rose-500', speed: 0.3, spawnRate: 4100, carScale: 0.48 },
    LEVEL_4: { level: 4, lanes: 3, obstaclesPerWave: 2, label: 'Cookie Crossing', color: 'from-amber-400 to-orange-500', speed: 0.32, spawnRate: 3900, carScale: 0.42 },
    LEVEL_5: { level: 5, lanes: 3, obstaclesPerWave: 2, label: 'Marshmallow Mile', color: 'from-violet-400 to-purple-600', speed: 0.35, spawnRate: 3600, carScale: 0.4 },
    LEVEL_6: { level: 6, lanes: 3, obstaclesPerWave: 2, label: 'Candy Canyon', color: 'from-red-400 to-pink-600', speed: 0.39, spawnRate: 3350, carScale: 0.38 },
    LEVEL_7: { level: 7, lanes: 4, obstaclesPerWave: 3, label: 'Rainbow Rush', color: 'from-sky-400 to-indigo-600', speed: 0.42, spawnRate: 3100, carScale: 0.33 },
    LEVEL_8: { level: 8, lanes: 4, obstaclesPerWave: 3, label: 'Sugarstorm Speedway', color: 'from-fuchsia-500 to-rose-600', speed: 0.46, spawnRate: 2850, carScale: 0.31 },
    LEVEL_9: { level: 9, lanes: 4, obstaclesPerWave: 3, label: 'Star Cup', color: 'from-yellow-400 to-red-500', speed: 0.5, spawnRate: 2600, carScale: 0.3 }
};

export const CerebralCarGame = ({ onBack, initialDifficulty }) => {
    // Game State
    const [difficulty, setDifficulty] = useState(null); // 'EASY', 'MEDIUM', 'HARD'
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SEC);
    const [score, setScore] = useState({
        validDodges: 0,
        missedDodges: 0,
        collisions: 0,
        totalWaves: 0
    });

    // Player State
    const [playerLane, setPlayerLane] = useState(0);
    const [obstacles, setObstacles] = useState([]);

    // Instruction State
    const [dodgeInstruction, setDodgeInstruction] = useState(null); // { targetLane: number, active: boolean }
    const [feedback, setFeedback] = useState(null); // 'GOOD', 'CRASH'
    const [isGameOver, setIsGameOver] = useState(false);

    // Audio Refs (Placeholder)

    // Refs
    const gameLoopRef = useRef();
    const lastTimeRef = useRef();
    const playerLaneRef = useRef(playerLane);
    const obstaclesRef = useRef(obstacles);
    const recordedResultRef = useRef(false);

    // Sync Refs
    useEffect(() => { playerLaneRef.current = playerLane; }, [playerLane]);
    useEffect(() => { obstaclesRef.current = obstacles; }, [obstacles]);

    // Timer
    useEffect(() => {
        if (!isPlaying || isGameOver) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, isGameOver]);

    // Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying || isGameOver || !difficulty) return;
            const lanes = DIFFICULTY_CONFIG[difficulty].lanes;

            if (e.key === 'ArrowLeft') {
                movePlayer(-1);
            } else if (e.key === 'ArrowRight') {
                movePlayer(1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isGameOver, difficulty]);

    const movePlayer = (direction) => {
        const lanes = DIFFICULTY_CONFIG[difficulty].lanes;
        setPlayerLane(prev => {
            const next = prev + direction;
            if (next >= 0 && next < lanes) return next;
            return prev;
        });
    };

    const startGame = (level) => {
        setDifficulty(level);
        const config = DIFFICULTY_CONFIG[level];
        // Start in middle-ish lane
        const startLane = Math.floor(config.lanes / 2);
        setPlayerLane(startLane);

        setIsPlaying(true);
        setIsGameOver(false);
        setTimeLeft(GAME_DURATION_SEC);
        setScore({ validDodges: 0, missedDodges: 0, collisions: 0, totalWaves: 0 });
        setObstacles([]);
        setDodgeInstruction(null);
        recordedResultRef.current = false;
    };

    useEffect(() => {
        if (!initialDifficulty || difficulty) return;
        const startingLevels = { EASY: 'LEVEL_1', MEDIUM: 'LEVEL_5', HARD: 'LEVEL_9' };
        startGame(startingLevels[initialDifficulty] || 'LEVEL_1');
    }, [initialDifficulty]);

    const endGame = () => {
        setIsGameOver(true);
        setIsPlaying(false);
        cancelAnimationFrame(gameLoopRef.current);
    };

    useEffect(() => {
        if (!isGameOver || recordedResultRef.current || !difficulty) return;
        const successfulWaves = Math.max(0, score.totalWaves - score.collisions);
        recordActivity({
            activity: `Cerebral Racer — ${DIFFICULTY_CONFIG[difficulty].label}`,
            skill: 'coordination',
            score: successfulWaves,
            maxScore: Math.max(1, score.totalWaves),
            durationSeconds: GAME_DURATION_SEC - timeLeft,
            details: { difficulty, collisions: score.collisions },
        });
        recordedResultRef.current = true;
    }, [difficulty, isGameOver, score, timeLeft]);

    // Game Loop
    useEffect(() => {
        if (!isPlaying || isGameOver) {
            cancelAnimationFrame(gameLoopRef.current);
            return;
        }

        let lastSpawn = 0;
        const config = DIFFICULTY_CONFIG[difficulty];

        const loop = (time) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const delta = time - lastTimeRef.current;
            lastTimeRef.current = time;

            // Spawn Logic
            if (time - lastSpawn > config.spawnRate) {
                spawnWave();
                lastSpawn = time;
            }

            updateGameObjects();
            gameLoopRef.current = requestAnimationFrame(loop);
        };

        gameLoopRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [isPlaying, isGameOver, difficulty]);

    const spawnWave = () => {
        const config = DIFFICULTY_CONFIG[difficulty];
        const lanes = config.lanes;
        const obsCount = config.obstaclesPerWave;

        // Strategy:
        // We need to spawn 'obsCount' obstacles.
        // We MUST leave at least one lane open? 
        // Logic:
        // Easy (2 lanes, 1 obs): 1 open.
        // Medium (3 lanes, 2 obs): 1 open.
        // Hard (4 lanes, 3 obs): 1 open.
        // ALWAYS 1 lane open is the standard runner rule.

        // Determination of "Safe Lane" logic
        // We want to force movement.
        // 60% chance to block CURRENT lane.

        let availableLanes = Array.from({ length: lanes }, (_, i) => i);
        let blockedLanes = [];

        // Decide which lanes to block
        // Random shuffle available
        availableLanes.sort(() => Math.random() - 0.5);

        // Take first N lanes
        for (let i = 0; i < obsCount; i++) {
            blockedLanes.push(availableLanes[i]);
        }

        const newObstacles = blockedLanes.map(lane => ({
            id: Date.now() + Math.random(),
            lane: lane,
            y: -20,
            hasCollided: false,
            instructionShown: false
        }));

        setObstacles(prev => [...prev, ...newObstacles]);
        setScore(s => ({ ...s, totalWaves: s.totalWaves + 1 }));
    };

    const updateGameObjects = () => {
        setObstacles(prev => {
            const nextObs = [];
            const currentLane = playerLaneRef.current;
            const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.LEVEL_1;

            // Standardized Coordinates (Percentage from Top)
            const PLAYER_TOP = 75;
            const PLAYER_BOTTOM = 90;

            // 1. Analyze Field for Safety
            const blockedLanes = new Set();
            prev.forEach(o => {
                if (o.y > -30 && o.y < PLAYER_BOTTOM) {
                    blockedLanes.add(o.lane);
                }
            });

            // 2. Determine Dodge Instruction
            let foundInstruction = null;
            const isCurrentLaneDangerous = blockedLanes.has(currentLane);

            if (isCurrentLaneDangerous) {
                let nearestSafeLane = -1;
                let minDist = Infinity;

                for (let l = 0; l < config.lanes; l++) {
                    if (!blockedLanes.has(l)) {
                        const dist = Math.abs(l - currentLane);
                        if (dist < minDist) {
                            minDist = dist;
                            nearestSafeLane = l;
                        }
                    }
                }

                if (nearestSafeLane !== -1) {
                    if (nearestSafeLane < currentLane) foundInstruction = 'LEFT';
                    else if (nearestSafeLane > currentLane) foundInstruction = 'RIGHT';
                } else {
                    foundInstruction = currentLane === 0 ? 'RIGHT' : 'LEFT';
                }
            }

            let frameCollisions = 0;

            // 3. Update & Collide
            prev.forEach(originalObs => {
                // Create a shallow copy to avoid mutating state directly
                const obs = { ...originalObs };
                obs.y += config.speed;

                const obsHeight = 15;
                const obsBottom = obs.y + obsHeight;

                const isLaneMatch = obs.lane === currentLane;
                const isVerticalOverlap = (obsBottom > PLAYER_TOP + 2) && (obs.y < PLAYER_BOTTOM - 2);

                if (isLaneMatch && isVerticalOverlap && !obs.hasCollided) {
                    obs.hasCollided = true;
                    frameCollisions++;
                }

                if (obs.y < 120) nextObs.push(obs);
            });

            // Handle Collisions (Side Effect)
            if (frameCollisions > 0) {
                // We need to update score OUTSIDE the reducer preferably, or inside?
                // setObstacles shouldn't trigger other state updates ideally, but in React events it's ok.
                // Batched updates work fine.
                setScore(s => ({ ...s, collisions: s.collisions + frameCollisions }));
                setFeedback('CRASH');
                setTimeout(() => setFeedback(null), 800);
            }

            // Update Instruction (Side Effect)
            if (isCurrentLaneDangerous && foundInstruction) {
                setDodgeInstruction({ direction: foundInstruction });
            } else {
                setDodgeInstruction(null);
            }

            return nextObs;
        });
    };

    // -- RENDERING --

    if (!difficulty) {
        return (
            <div className="game-shell flex min-h-[60vh] max-w-4xl flex-col items-center justify-center">
                <h2 className="mb-2 text-5xl font-bold text-bingo-navy">Cerebral Racer 🏎️</h2>
                <p className="mb-8 max-w-md text-center font-semibold text-bingo-navy/65">
                    Follow the candy road. Every level adds speed, lanes, and trickier traffic.
                </p>

                <div className="relative mb-12 w-full max-w-2xl space-y-4 py-4">
                    <div className="absolute bottom-8 left-1/2 top-8 w-4 -translate-x-1/2 rounded-full bg-gradient-to-b from-bingo-yellow via-bingo-coral to-bingo-indigo opacity-35" />
                    {Object.keys(DIFFICULTY_CONFIG).map((key, index) => {
                        const level = DIFFICULTY_CONFIG[key];
                        return (
                            <div key={key} className={`relative z-10 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                <button onClick={() => startGame(key)} className="toon-card flex w-[47%] min-w-56 items-center gap-3 p-4 text-left hover:scale-[1.03]">
                                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-black text-white shadow-pop-sm ${level.color}`}>{level.level}</span>
                                    <span>
                                        <span className="block font-display text-base font-bold text-bingo-navy">{level.label}</span>
                                        <span className="text-xs font-bold text-bingo-navy/45">{level.lanes} lanes · speed {level.level}</span>
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>
                <button onClick={onBack} className="toon-button-secondary">
                    Back to Menu
                </button>
            </div>
        );
    }

    // In-Game Render
    const config = DIFFICULTY_CONFIG[difficulty];
    const laneWidthPercent = 100 / config.lanes;

    return (
        <div className="relative mx-auto h-[80vh] w-full max-w-3xl overflow-hidden rounded-[2.5rem] border-[6px] border-bingo-navy bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 shadow-pop">
            <div className="absolute left-0 right-0 top-[14%] z-0 flex justify-around text-5xl" aria-hidden="true">
                <span>🍭</span><span>☁️</span><span>🍬</span><span>🧁</span><span>☁️</span>
            </div>
            {/* Road Surface */}
            <div className="absolute -bottom-[12%] left-[-18%] right-[-18%] top-[22%] flex origin-top bg-gradient-to-b from-slate-600 to-slate-950 [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]">
                {Array.from({ length: config.lanes }).map((_, i) => (
                    <div key={i} className="h-full border-r-2 border-dashed border-white/20 relative" style={{ width: `${laneWidthPercent}%` }}>
                        {/* Lane Number (optional debugging) */}
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/10 text-4xl font-black">{i + 1}</span>
                    </div>
                ))}
            </div>

            {/* Moving Road Texture (Simulated) */}
            <RoadLines speed={config.speed} />

            {/* Obstacles */}
            {obstacles.map(obs => (
                <div
                    key={obs.id}
                    className="absolute z-10 transition-transform"
                    style={{
                        width: `${laneWidthPercent * config.carScale}%`, // Dynamic car size
                        left: `${(obs.lane * laneWidthPercent) + (laneWidthPercent / 2)}%`,
                        top: `${obs.y}%`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className={`relative aspect-[2/3] w-full rounded-[38%_38%_20%_20%] border-4 shadow-[0_14px_22px_rgba(0,0,0,.5)]
                        ${obs.hasCollided ? 'bg-slate-700 grayscale scale-90 rotate-12 opacity-80' : 'border-red-200 bg-gradient-to-b from-red-200 via-red-500 to-red-900'}
                    `}>
                        {obs.hasCollided && (
                            <div className="absolute inset-0 flex items-center justify-center text-3xl">💥</div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2 h-[20%] bg-sky-900/50 rounded-sm"></div>
                        <div className="absolute left-[12%] right-[12%] top-[12%] h-[25%] rounded-t-xl bg-sky-100/80" />
                        <div className="absolute -bottom-1 -left-2 h-7 w-4 rounded-full bg-slate-950" />
                        <div className="absolute -bottom-1 -right-2 h-7 w-4 rounded-full bg-slate-950" />
                    </div>
                </div>
            ))}

            {/* Player Car */}
            <motion.div
                className="absolute bottom-20 z-20"
                animate={{
                    left: `${(playerLane * laneWidthPercent) + (laneWidthPercent / 2)}%`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{
                    width: `${laneWidthPercent * config.carScale}%`, // Dynamic player size
                    translateX: "-50%"
                }}
            >
                <div className="group relative aspect-[2/3] w-full overflow-visible rounded-[38%_38%_18%_18%] border-4 border-cyan-200 bg-gradient-to-b from-cyan-200 via-blue-500 to-indigo-950 shadow-[0_18px_26px_rgba(0,0,0,.55)]">
                    <div className="absolute top-2 left-2 right-2 h-[20%] bg-sky-900/50 rounded-sm"></div>
                    <div className="absolute bottom-2 left-2 right-2 h-[10%] bg-red-500/80 rounded-sm"></div>
                    <div className="absolute -bottom-2 -left-2 h-8 w-4 rounded-full bg-slate-950" />
                    <div className="absolute -bottom-2 -right-2 h-8 w-4 rounded-full bg-slate-950" />
                    {/* Headlights */}
                    <div className="absolute -top-12 left-2 w-4 h-24 bg-yellow-200/40 blur-md rounded-full"></div>
                    <div className="absolute -top-12 right-2 w-4 h-24 bg-yellow-200/40 blur-md rounded-full"></div>
                </div>
            </motion.div>

            {/* GUI Layer */}
            <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-1 bg-black/40 p-2 rounded-xl backdrop-blur-sm text-white">
                    <span className="text-xs opacity-80 uppercase tracking-widest">Time</span>
                    <span className="text-2xl font-mono font-bold">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
                </div>
                <div className="flex flex-col items-end gap-1 bg-black/40 p-2 rounded-xl backdrop-blur-sm text-white">
                    <span className="text-xs opacity-80 uppercase tracking-widest">Crashes</span>
                    <span className="text-xl font-bold text-red-500">{score.collisions}</span>
                </div>
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
                {dodgeInstruction && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-40 left-0 right-0 z-40 flex justify-center pointer-events-none"
                    >
                        <div className="toon-panel flex flex-col items-center gap-2 border-bingo-indigo px-10 py-6 backdrop-blur-xl">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dodge</div>
                            <span className="text-6xl font-black text-rose-600 tracking-wider font-mono drop-shadow-sm">{dodgeInstruction.direction}</span>
                        </div>
                    </motion.div>
                )}

                {feedback === 'CRASH' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 text-6xl"
                    >
                        💥
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between z-40 md:hidden pointer-events-auto">
                <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full text-4xl shadow-lg active:scale-90 transition-transform" onClick={() => movePlayer(-1)}>⬅️</button>
                <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full text-4xl shadow-lg active:scale-90 transition-transform" onClick={() => movePlayer(1)}>➡️</button>
            </div>

            {/* Game Over Screen */}
            {isGameOver && (
                <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-8">
                    <div className="celebration-burst toon-panel w-full max-w-md p-8 text-center">
                        <h2 className="text-3xl font-black text-slate-800 mb-6">Race Finished! 🏁</h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <StatBox label="Valid Waves" value={score.totalWaves - score.collisions} color="text-indigo-600" />
                            <StatBox label="Crashes" value={score.collisions} color="text-red-600" />
                            <StatBox label="Total Waves" value={score.totalWaves} color="text-amber-500" />
                            <StatBox label="Score" value={(score.totalWaves - score.collisions) * 100} color="text-emerald-600" />
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setDifficulty(null)} className="toon-button-secondary">Menu</button>
                            <button onClick={() => startGame(difficulty)} className="toon-button bg-bingo-indigo text-white">Race Again</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple animated lines to give speed sensation
const RoadLines = ({ speed }) => {
    const [offset, setOffset] = useState(0);
    const reqRef = useRef();

    useEffect(() => {
        let lastTime;
        const loop = (time) => {
            if (!lastTime) lastTime = time;
            const delta = time - lastTime;
            // Speed factor
            setOffset(prev => (prev + speed * 1.5) % 100);
            reqRef.current = requestAnimationFrame(loop);
        };
        reqRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(reqRef.current);
    }, [speed]);

    return (
        <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
                backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 50px, rgba(255,255,255,0.5) 50px, rgba(255,255,255,0.5) 100px)',
                backgroundPosition: `0 ${offset}%`,
                backgroundSize: '100% 100px'
            }}
        />
    );
};

const StatBox = ({ label, value, color }) => (
    <div className="bg-slate-50 p-4 rounded-2xl">
        <span className="block text-xs uppercase font-bold text-slate-400 mb-1">{label}</span>
        <span className={`text-3xl font-black ${color}`}>{value}</span>
    </div>
);
