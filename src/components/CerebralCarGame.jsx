import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Game Constants
const GAME_DURATION_SEC = 90;
const ROAD_LANES = 2;
const OBSTACLE_SPWAN_RATE_MS = 1500;
const TURN_EVENT_INTERVAL_MS = 10000; // Turn event every 10s
const TURN_WINDOW_MS = 4000; // 4s to react
const GAME_SPEED = 0.8; // Vertical speed percent per frame

export const CerebralCarGame = ({ onBack }) => {
    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SEC);
    const [score, setScore] = useState({
        validTurns: 0,
        invalidTurns: 0,
        totalObstacles: 0,
        collisions: 0
    });
    const [playerLane, setPlayerLane] = useState(0); // 0: Left, 1: Right
    const [obstacles, setObstacles] = useState([]); // Array of { id, lane, y, type }
    const [turnInstruction, setTurnInstruction] = useState(null); // null, 'LEFT', 'RIGHT'
    const [turnStatus, setTurnStatus] = useState(null); // 'SUCCESS', 'MISSED', null
    const [isGameOver, setIsGameOver] = useState(false);

    // New: World Rotation State for visual turn effect
    const [worldRotation, setWorldRotation] = useState(0);

    // New: Road Segments
    // We visualize road as moving segments. 
    // Type: 'STRAIGHT' | 'TURN_LEFT' | 'TURN_RIGHT'
    const [roadSegments, setRoadSegments] = useState([]);

    // Refs for game loop logic
    const gameLoopRef = useRef();
    const lastTimeRef = useRef();
    const scoreRef = useRef(score);
    const playerLaneRef = useRef(playerLane);
    const obstaclesRef = useRef(obstacles);
    const turnInstructionRef = useRef(turnInstruction);

    // Sync refs
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { playerLaneRef.current = playerLane; }, [playerLane]);
    useEffect(() => { obstaclesRef.current = obstacles; }, [obstacles]);
    useEffect(() => { turnInstructionRef.current = turnInstruction; }, [turnInstruction]);

    // Timer Effect
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

    // Input Handling
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isPlaying || isGameOver) return;
            if (e.key === 'ArrowLeft') movePlayer(0);
            else if (e.key === 'ArrowRight') movePlayer(1);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, isGameOver]);

    // Game Loop
    useEffect(() => {
        if (!isPlaying || isGameOver) {
            cancelAnimationFrame(gameLoopRef.current);
            return;
        }

        let lastSpawn = 0;

        // Initial segments (just linear road)
        const initialSegments = [];
        for (let i = 0; i < 6; i++) {
            initialSegments.push({ id: i, y: i * 20 - 20, type: 'STRAIGHT' });
        }
        setRoadSegments(initialSegments);

        const loop = (time) => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const delta = time - lastTimeRef.current;
            lastTimeRef.current = time;

            // Spawn Obstacles
            if (time - lastSpawn > OBSTACLE_SPWAN_RATE_MS) {
                spawnObstacle();
                lastSpawn = time;
            }

            updateGameObjects(delta);
            gameLoopRef.current = requestAnimationFrame(loop);
        };

        gameLoopRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(gameLoopRef.current);
    }, [isPlaying, isGameOver]);

    const startGame = () => {
        setIsPlaying(true);
        setIsGameOver(false);
        setTimeLeft(GAME_DURATION_SEC);
        setScore({ validTurns: 0, invalidTurns: 0, totalObstacles: 0, collisions: 0 });
        setObstacles([]);
        setTurnInstruction(null);
        setPlayerLane(0);
    };

    const endGame = () => {
        setIsGameOver(true);
        setIsPlaying(false);
    };

    const spawnObstacle = () => {
        // High chance to spawn in Player's current lane to force movement?
        // Or random?
        // User wants: "signal to move when a obstacle vehincle comes on that lane and user is on that lane"

        // Let's spawn in the lane the player is currently in to trigger the "Cerebral" reaction test.
        // 60% chance to spawn in player lane.
        const targetLane = Math.random() < 0.6 ? playerLaneRef.current : (playerLaneRef.current === 0 ? 1 : 0);

        const newObstacle = {
            id: Date.now() + Math.random(),
            lane: targetLane,
            y: -20,
            hasCollided: false,
            instructionShown: false // Track if we signaled for this
        };
        setObstacles(prev => [...prev, newObstacle]);
        setScore(prev => ({ ...prev, totalObstacles: prev.totalObstacles + 1 }));
    };

    const movePlayer = (targetLane) => {
        // Did we move in response to an instruction?
        const currentInstruction = turnInstructionRef.current; // 'LEFT' or 'RIGHT'
        const previousLane = playerLaneRef.current;

        setPlayerLane(targetLane);

        // Validation Logic
        // If there was an instruction (meaning impending crash), and we moved to safe lane:
        if (currentInstruction) {
            // Instruction 'LEFT' means "Go Left". Target is 0.
            // Instruction 'RIGHT' means "Go Right". Target is 1.
            const requiredLane = currentInstruction === 'LEFT' ? 0 : 1;

            if (targetLane === requiredLane) {
                // Success! We moved to safe lane.
                handleTurnResult(true);
            }
        }
    };

    const handleTurnResult = (success) => {
        setTurnInstruction(null);
        if (success) {
            setScore(prev => ({ ...prev, validTurns: prev.validTurns + 1 }));
            setTurnStatus('SUCCESS');
        } else {
            // We only count invalid turns if they actually crash, which is handled in collision logic?
            // Or if they move to WRONG lane?
            // For now, simple success feedback.
        }
        setTimeout(() => setTurnStatus(null), 1000);
    };

    const updateGameObjects = (delta) => {
        // Update Road
        setRoadSegments(prev => {
            // Simple scrolling
            let next = prev.map(s => ({ ...s, y: s.y + GAME_SPEED }));
            if (next[next.length - 1].y >= 0 && next.length < 8) {
                // Add new segment at top
                // Find min y
                const minY = next[0].y;
                next.unshift({ id: Date.now(), y: minY - 20, type: 'STRAIGHT' });
            }
            return next.filter(s => s.y < 120);
        });

        // Update Obstacles & Logic
        setObstacles(prev => {
            const nextObstacles = [];
            let collisionDetect = 0;
            const playerY = 80;
            const currentLane = playerLaneRef.current;

            // Logic to determine if we should show instruction
            // Find the closest incoming obstacle in MY LANE
            const limitY = 40; // Look ahead

            // Check for instructions
            // Use a ref-based approach or just find first dangerous obstacle
            // We do this outside the map to avoid multi-set

            prev.forEach(obs => {
                obs.y += GAME_SPEED;

                // Alert Logic
                // If obstacle is in Player Lane, coming down (y > -10), and we haven't shown instruction yet
                if (!obs.instructionShown && obs.lane === currentLane && obs.y > -10 && obs.y < 40) {
                    obs.instructionShown = true;
                    // Signal to move AWAY
                    const safeLane = currentLane === 0 ? 1 : 0;
                    setTurnInstruction(safeLane === 0 ? 'LEFT' : 'RIGHT');
                }

                // If we moved away, clear instruction?
                if (turnInstructionRef.current && obs.instructionShown && obs.lane !== currentLane) {
                    // We are safe now.
                    // Instruction cleared in movePlayer, but also here failsafe?
                    setTurnInstruction(null);
                }

                // Collision
                if (
                    !obs.hasCollided &&
                    obs.lane === currentLane &&
                    obs.y + 10 >= playerY && obs.y <= playerY + 15
                ) {
                    obs.hasCollided = true;
                    collisionDetect++;
                    // If we collide, it means we monitored an Invalid Turn (did not move)
                    if (obs.instructionShown) {
                        setScore(s => ({ ...s, invalidTurns: s.invalidTurns + 1 }));
                        setTurnStatus('MISSED');
                        setTurnInstruction(null);
                        setTimeout(() => setTurnStatus(null), 1000);
                    }
                }

                if (obs.y < 120) nextObstacles.push(obs);
            });

            if (collisionDetect > 0) {
                // Sync collision score
                // handled in effect or here
            }
            return nextObstacles;
        });

        setObstacles(current => {
            const collided = current.filter(o => o.hasCollided && !o.counted);
            if (collided.length > 0) {
                setScore(s => ({ ...s, collisions: s.collisions + collided.length }));
                return current.map(o => o.hasCollided ? { ...o, counted: true } : o);
            }
            return current;
        });
    };

    if (!isPlaying && !isGameOver) {
        return (
            <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-8 text-center min-h-[60vh]">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">Cerebral Racer 🏎️</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
                    Drive your car and dodge the traffic! <br />
                    When you see a <b>TURN</b>, drive to that side and press the arrow key!
                </p>
                <div className="flex gap-4 justify-center">
                    <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300">
                        Back
                    </button>
                    <button onClick={startGame} className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xl">
                        Start Engine! 🏁
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-2xl mx-auto h-[80vh] bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700">
            {/* Background Road Layer */}
            <div className="absolute inset-0 bg-slate-800 overflow-hidden">
                {/* Render Segments */}
                {roadSegments.map(segment => (
                    <RoadSegment key={segment.id} y={segment.y} />
                ))}
            </div>

            {/* Obstacles */}
            {obstacles.map(obs => (
                <div
                    key={obs.id}
                    className="absolute z-10 w-[20%] max-w-[80px] transition-transform"
                    style={{
                        left: obs.lane === 0 ? '25%' : '75%',
                        top: `${obs.y}%`,
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div className={`w-full aspect-[2/3] rounded-2xl shadow-lg border-4 relative 
                        ${obs.hasCollided ? 'bg-slate-700 grayscale scale-90 rotate-12 opacity-80' : 'bg-red-500 border-red-300'}
                    `}>
                        {obs.hasCollided && (
                            <div className="absolute inset-0 flex items-center justify-center text-3xl">💥</div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2 h-[20%] bg-sky-900/50 rounded-sm"></div>
                    </div>
                </div>
            ))}

            {/* Player Car */}
            <motion.div
                className="absolute bottom-20 z-20 w-[20%] max-w-[80px]"
                animate={{
                    left: playerLane === 0 ? '25%' : '75%',
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ translateX: "-50%" }}
            >
                <div className="w-full aspect-[2/3] bg-blue-500 rounded-2xl shadow-lg border-4 border-blue-300 relative overflow-hidden group">
                    <div className="absolute top-2 left-2 right-2 h-[20%] bg-sky-900/50 rounded-sm"></div>
                    <div className="absolute bottom-2 left-2 right-2 h-[10%] bg-red-500/80 rounded-sm"></div>
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
                <div className="flex flex-col items-end gap-1 bg-black/40 p-2 rounded-xl backdrop-blur-sm">
                    <span className="text-xs opacity-80 text-white uppercase tracking-widest">Dodged</span>
                    <span className="text-xl font-bold text-yellow-400">{score.totalObstacles}</span>
                </div>
            </div>

            {/* Mobile Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between z-40 md:hidden pointer-events-auto">
                <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full text-4xl shadow-lg active:scale-90 transition-transform" onClick={() => movePlayer(0)}>⬅️</button>
                <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full text-4xl shadow-lg active:scale-90 transition-transform" onClick={() => movePlayer(1)}>➡️</button>
            </div>

            {/* Interaction Feedback / Warning */}
            <AnimatePresence>
                {turnInstruction && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute bottom-40 left-0 right-0 z-40 flex justify-center pointer-events-none"
                    >
                        <div className={`
                            bg-white/90 backdrop-blur border-4 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3
                            ${turnInstruction === 'LEFT' ? 'border-indigo-500' : 'border-indigo-500'}
                       `}>
                            <span className="text-4xl">{turnInstruction === 'LEFT' ? '⬅️' : '➡️'}</span>
                            <div>
                                <h3 className="text-xl font-black text-rose-600 uppercase">DODGE!</h3>
                                <p className="text-xs font-bold text-slate-500">Go {turnInstruction}!</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {turnStatus && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1.2, opacity: 1 }}
                        exit={{ scale: 1.5, opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        {turnStatus === 'SUCCESS' ? (
                            <div className="text-6xl md:text-8xl font-black text-emerald-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] stroke-black">VALID!</div>
                        ) : (
                            <div className="text-6xl md:text-8xl font-black text-rose-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">HIT!</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game Over Screen */}
            {isGameOver && (
                <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-8">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center">
                        <h2 className="text-3xl font-black text-slate-800 mb-6">Race Finished! 🏁</h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <StatBox label="Valid Dodges" value={score.validTurns} color="text-indigo-600" />
                            <StatBox label="Crashes" value={score.collisions} color="text-red-600" />
                            <StatBox label="Total Cars" value={score.totalObstacles} color="text-amber-500" />
                            <StatBox label="Score" value={score.validTurns * 10 - score.collisions * 5} color="text-emerald-600" />
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300">Exit</button>
                            <button onClick={startGame} className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700">Race Again</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RoadSegment = ({ y }) => {
    return (
        <div
            className="absolute left-0 right-0 h-[25%] pointer-events-none flex justify-center items-center"
            style={{
                top: `${y}%`,
                height: '25%'
            }}
        >
            {/* The Main Road Strip */}
            <div className="relative w-[70%] h-full bg-slate-700 border-x-4 border-white/20 overflow-visible">
                {/* Lane Divider */}
                <div className="absolute inset-y-0 left-1/2 w-2 border-r-2 border-dashed border-white/40 -translate-x-1/2"></div>

                {/* Side Grass */}
                <div className="absolute top-0 bottom-0 right-[100%] w-[100px] bg-emerald-800 border-r-4 border-slate-600 opacity-50"></div>
                <div className="absolute top-0 bottom-0 left-[100%] w-[100px] bg-emerald-800 border-l-4 border-slate-600 opacity-50"></div>
            </div>
        </div>
    );
};

const StatBox = ({ label, value, color }) => (
    <div className="bg-slate-50 p-4 rounded-2xl">
        <span className="block text-xs uppercase font-bold text-slate-400 mb-1">{label}</span>
        <span className={`text-3xl font-black ${color}`}>{value}</span>
    </div>
);
