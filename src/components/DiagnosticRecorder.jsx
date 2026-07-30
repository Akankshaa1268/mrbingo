import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { recordActivity } from '../utils/activityHistory.js';
import faceLandmarkerModel from '../public/face_landmarker.task?url';

// --- 1. LOGIC ENGINE (Unchanged) ---
class SocialDiagnosticModule {
    constructor() {
        this.MOVEMENT_TOLERANCE = 0.065;
        this.total_focus_time = 0.0;
        this.total_distraction_time = 0.0;
        this.current_streak = 0.0;
        this.max_streak = 0.0;
        this.LEFT_EYE = [33, 133, 159, 145, 468];
        this.RIGHT_EYE = [362, 263, 386, 374, 473];
        this.calibrationSamples = [];
        this.baseline = null;
    }

    _dist(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    _get_gaze_ratio(landmarks, indices) {
        const left = landmarks[indices[0]];
        const right = landmarks[indices[1]];
        const top = landmarks[indices[2]];
        const bottom = landmarks[indices[3]];
        const iris = landmarks[indices[4]];
        const width = Math.abs(right.x - left.x);
        const height = Math.abs(bottom.y - top.y);
        return {
            x: width ? (iris.x - Math.min(left.x, right.x)) / width : 0.5,
            y: height ? (iris.y - Math.min(top.y, bottom.y)) / height : 0.5,
        };
    }

    process(landmarks, dt) {
        if (!landmarks) return null;
        const leftRatio = this._get_gaze_ratio(landmarks, this.LEFT_EYE);
        const rightRatio = this._get_gaze_ratio(landmarks, this.RIGHT_EYE);
        const gaze = {
            x: (leftRatio.x + rightRatio.x) / 2,
            y: (leftRatio.y + rightRatio.y) / 2,
        };

        if (!this.baseline) {
            this.calibrationSamples.push(gaze);
            if (this.calibrationSamples.length >= 24) {
                this.baseline = {
                    x: this.calibrationSamples.reduce((sum, sample) => sum + sample.x, 0) / this.calibrationSamples.length,
                    y: this.calibrationSamples.reduce((sum, sample) => sum + sample.y, 0) / this.calibrationSamples.length,
                };
            }
            return {
                gazeScore: 0,
                currentZone: "CALIBRATING",
                isFocused: true,
                isCalibrating: true,
                currentStreak: 0,
                landmarks,
            };
        }

        const movement = Math.hypot(gaze.x - this.baseline.x, gaze.y - this.baseline.y);

        let zone = "UNKNOWN";
        let isFocused = false;

        if (movement <= this.MOVEMENT_TOLERANCE) {
            zone = "CENTER_FOCUS";
            isFocused = true;
            this.total_focus_time += dt;
            this.current_streak += dt;
            if (this.current_streak > this.max_streak) this.max_streak = this.current_streak;
        } else {
            this.current_streak = 0;
            if (gaze.x < this.baseline.x) {
                zone = "DISTRACTION_LEFT";
                this.total_distraction_time += dt;
            } else {
                zone = "DISTRACTION_RIGHT";
                this.total_distraction_time += dt;
            }
        }

        return {
            gazeScore: movement,
            currentZone: zone,
            isFocused: isFocused,
            currentStreak: this.current_streak,
            landmarks: landmarks
        };
    }

    getMetrics() {
        const total = this.total_focus_time + this.total_distraction_time;
        const score = total > 0 ? (this.total_focus_time / total) * 100 : 0;
        return {
            focusScore: score.toFixed(1),
            maxStreak: this.max_streak.toFixed(1),
            totalFocus: this.total_focus_time.toFixed(1),
            totalDistraction: this.total_distraction_time.toFixed(1)
        };
    }
}

// --- 2. REACT COMPONENT ---
const DiagnosticRecorder = ({ onBack, difficulty = "MEDIUM" }) => {
    const sessionDuration = { EASY: 20, MEDIUM: 30, HARD: 40 }[difficulty] || 30;
    const distractionRate = { EASY: 0.025, MEDIUM: 0.045, HARD: 0.07 }[difficulty] || 0.045;
    const [gameState, setGameState] = useState('loading'); 
    const [report, setReport] = useState(null);
    const [cameraError, setCameraError] = useState("");
    const recordedResultRef = useRef(false);
    const [debugInfo, setDebugInfo] = useState({ gaze: 0, zone: 'WAITING' });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const landmarkerRef = useRef(null);
    const socialAIRef = useRef(new SocialDiagnosticModule());
    const requestRef = useRef(null);
    const lastTimeRef = useRef(0);
    const startTimeRef = useRef(0); // Track start time
    const gameStateRef = useRef('loading'); 
    const particlesRef = useRef([]);
    const streamRef = useRef(null);

    useEffect(() => {
        const initAI = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );

                try {
                    landmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                        baseOptions: { modelAssetPath: faceLandmarkerModel, delegate: "GPU" },
                        outputFaceBlendshapes: true,
                        runningMode: "VIDEO",
                        numFaces: 1
                    });
                } catch {
                    landmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                        baseOptions: { modelAssetPath: faceLandmarkerModel, delegate: "CPU" },
                        outputFaceBlendshapes: true,
                        runningMode: "VIDEO",
                        numFaces: 1
                    });
                }
                setGameState('permission');
                gameStateRef.current = 'permission';

            } catch (error) {
                console.error("Init Error:", error);
                setCameraError("The eye-tracking model could not load. Please refresh and try again.");
                setGameState('error');
            }
        };

        initAI();

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    const requestCamera = async () => {
        setCameraError("");
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("Camera access is not supported in this browser.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });
            streamRef.current = stream;
            if (!videoRef.current) return;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setGameState('ready');
            gameStateRef.current = 'ready';
        } catch (error) {
            setCameraError(error?.name === "NotAllowedError"
                ? "Camera permission was blocked. Allow camera access in your browser settings, then try again."
                : error.message || "The camera could not be started.");
            setGameState('error');
            gameStateRef.current = 'error';
        }
    };

    const startGame = () => {
        recordedResultRef.current = false;
        if (!landmarkerRef.current) return;
        socialAIRef.current = new SocialDiagnosticModule();
        particlesRef.current = []; 
        setGameState('playing');
        gameStateRef.current = 'playing';
        
        const now = performance.now();
        lastTimeRef.current = now;
        startTimeRef.current = now; // Set Start Time
        
        loop(now);
    };

    useEffect(() => {
        if (gameState !== 'result' || !report || recordedResultRef.current) return;
        recordActivity({
            activity: `Focus Diagnostic — ${difficulty[0] + difficulty.slice(1).toLowerCase()}`,
            skill: 'attention',
            score: Number(report.focusScore) || 0,
            maxScore: 100,
            durationSeconds: Math.round(
                (Number(report.totalFocus) || 0) + (Number(report.totalDistraction) || 0)
            ),
            details: {
                longestFocusStreak: Number(report.maxStreak) || 0,
                distractedSeconds: Number(report.totalDistraction) || 0,
            },
        });
        recordedResultRef.current = true;
    }, [gameState, report]);

    const stopGame = () => {
        gameStateRef.current = 'result';
        setGameState('result');
        const metrics = socialAIRef.current.getMetrics();
        setReport(metrics);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };

    const loop = (time) => {
        if (gameStateRef.current !== 'playing') return;

        // 1. Calculate Time Logic
        const dt = (time - lastTimeRef.current) / 1000;
        lastTimeRef.current = time;

        const elapsedTime = (time - startTimeRef.current) / 1000;
        const timeLeft = Math.max(0, sessionDuration - elapsedTime);

        // 2. Stop if time is up
        if (timeLeft <= 0) {
            stopGame();
            return;
        }

        // 3. MediaPipe & Logic
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas && landmarkerRef.current) {
            const results = landmarkerRef.current.detectForVideo(video, time);
            let data = null;
            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                data = socialAIRef.current.process(results.faceLandmarks[0], dt);
            }
            
            // 4. Draw Game Scene
            drawGame(canvas, video, data, time, timeLeft);
            
            if (data) setDebugInfo({ gaze: data.gazeScore.toFixed(3), zone: data.currentZone });
        }
        requestRef.current = requestAnimationFrame(loop);
    };

    // --- 3. VISUAL ENGINE (Black Screen + Lucid Icons) ---
    const drawGame = (canvas, video, data, time, timeLeft) => {
        const ctx = canvas.getContext('2d');
        
        if (canvas.width !== video.videoWidth) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }
        
        const w = canvas.width;
        const h = canvas.height;

        // A. DRAW BLACK BACKGROUND (Hide User)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        // B. FALLING LUCID ICONS (Distractions)
        // Spawn Logic (Slightly faster spawn rate for distraction)
        if (Math.random() < distractionRate) {
            const distractions = ['🧸', '🍭', '🧁', '🚀', '🍎', '⚽'];
            particlesRef.current.push({
                x: Math.random() * w,
                y: -30,
                size: Math.random() * 18 + 24,
                speed: Math.random() * 2 + 1,
                icon: distractions[Math.floor(Math.random() * distractions.length)],
            });
        }

        // Draw Logic
        ctx.shadowBlur = 15; // Glow effect
        particlesRef.current.forEach((p, i) => {
            p.y += p.speed;
            ctx.font = `${p.size}px "Segoe UI Emoji", sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(p.icon, p.x, p.y);

            if (p.y > h) particlesRef.current.splice(i, 1);
        });
        ctx.shadowBlur = 0; // Reset glow

        // C. CENTER RED DOT (Focus Target)
        const cx = w * 0.5;
        const cy = h * 0.5;
        const pulse = Math.sin(time / 200) * 5; 
        
        let dotColor = '#FF0000';
        let ringColor = 'rgba(255, 0, 0, 0.3)';

        // Turn Green if Focused
        if (data && data.isFocused) {
            dotColor = '#00FF00';
            ringColor = 'rgba(0, 255, 0, 0.3)';
        }
        if (data?.isCalibrating) {
            dotColor = '#FFD43B';
            ringColor = 'rgba(255, 212, 59, 0.35)';
        }

        // Draw Target
        ctx.beginPath();
        ctx.arc(cx, cy, 25 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = ringColor;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 12, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = dotColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // D. TIMER & DEBUG TEXT
        // Note: We flip context horizontally for text because of the mirror transform
        ctx.save();
        ctx.translate(w, 0);
        ctx.scale(-1, 1);
        
        // Timer Text
        ctx.fillStyle = "white";
        ctx.font = "bold 24px monospace";
        ctx.fillText(`⏱️ ${timeLeft.toFixed(1)}s`, 20, 40);

        // Instructions (Subtle)
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(data?.isCalibrating ? "KEEP LOOKING AT THE DOT — CALIBRATING" : "STARE AT THE DOT", w/2, h - 30);
        
        ctx.restore();
    };

    return (
        <div className="relative h-screen w-full overflow-hidden bg-bingo-navy">
            {/* 1. LAYERS */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                // Video is technically rendered but covered by canvas opacity
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 opacity-0" 
            />
            
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" 
            />

            {/* 2. OVERLAYS */}
            {(gameState === 'loading' || gameState === 'permission' || gameState === 'ready' || gameState === 'error') && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-bingo-navy p-5 text-white">
                    <h1 className="mb-4 text-5xl font-bold">Focus Challenge</h1>
                    {gameState === 'loading' && (
                        <div className="toon-kicker animate-pulse text-bingo-navy">🤖 Mr. Bingo is getting ready…</div>
                    )}
                    {gameState === 'permission' && (
                        <div className="max-w-md text-center">
                            <p className="mb-6 text-gray-300">
                                Camera access is used only here to estimate whether your eyes stay near the center dot. Video is not uploaded or saved.
                            </p>
                            <button onClick={requestCamera} className="toon-button-primary px-8">Enable camera</button>
                            <button onClick={onBack} className="toon-button-secondary ml-3">Back</button>
                        </div>
                    )}
                    {gameState === 'ready' && (
                        <div className="text-center">
                            <p className="mb-6 text-gray-400">
                                The screen will turn black.<br/>
                                Ignore the toys and treats.<br/>
                                Green means focused; red means your gaze moved.
                            </p>
                            <button onClick={startGame} className="toon-button-primary px-8">
                                Start {sessionDuration}s Test
                            </button>
                        </div>
                    )}
                    {gameState === 'error' && (
                        <div className="max-w-md text-center">
                            <p className="mb-6 rounded-2xl bg-red-500/15 p-4 font-semibold text-red-200">{cameraError}</p>
                            <button onClick={requestCamera} className="toon-button-primary px-8">Try camera again</button>
                            <button onClick={onBack} className="toon-button-secondary ml-3">Back</button>
                        </div>
                    )}
                </div>
            )}

            {gameState === 'result' && report && (
                <div className="celebration-burst absolute inset-0 z-50 flex flex-col items-center justify-center bg-bingo-yellow/20 p-5 text-bingo-navy">
                    <div className="toon-panel w-full max-w-sm p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">Time's Up! 🏁</h2>
                        <div className="text-6xl font-black text-blue-600 mb-2">{report.focusScore}%</div>
                        <div className="text-gray-500 mb-6">Focus Score</div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-left bg-gray-50 p-4 rounded-lg">
                            <div>Longest Streak:</div>
                            <div className="font-bold">{report.maxStreak}s</div>
                            <div>Distracted Time:</div>
                            <div className="font-bold text-red-500">{report.totalDistraction}s</div>
                        </div>

                        <button onClick={startGame} className="toon-button mt-6 w-full bg-bingo-indigo text-white">
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Stop Button */}
            {gameState === 'playing' && (
                <button 
                    onClick={stopGame}
                    className="toon-button absolute right-4 top-4 z-40 min-h-10 bg-bingo-coral px-4 py-2 text-sm text-white"
                >
                    Quit
                </button>
            )}
        </div>
    );
};

export default DiagnosticRecorder;
