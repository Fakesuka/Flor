'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

interface StorySlide {
    id: number;
    image: string;
    sort_order: number;
}

interface Story {
    id: number;
    title: string;
    cover_image: string;
    slides: StorySlide[];
}

interface StoryViewerProps {
    stories: Story[];
    initialStoryIndex: number;
    onClose: () => void;
}

const SLIDE_DURATION = 5000; // 5 seconds per slide

export default function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
    const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
    const [slideIndex, setSlideIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef(Date.now());
    const elapsedRef = useRef(0);

    const currentStory = stories[storyIndex];
    const currentSlides = currentStory?.slides || [];
    const currentSlide = currentSlides[slideIndex];

    // Navigate to next slide or next story
    const goNext = useCallback(() => {
        if (slideIndex < currentSlides.length - 1) {
            setSlideIndex((i) => i + 1);
            setProgress(0);
            elapsedRef.current = 0;
        } else if (storyIndex < stories.length - 1) {
            setStoryIndex((i) => i + 1);
            setSlideIndex(0);
            setProgress(0);
            elapsedRef.current = 0;
        } else {
            onClose();
        }
    }, [slideIndex, storyIndex, currentSlides.length, stories.length, onClose]);

    // Navigate to previous slide or previous story
    const goPrev = useCallback(() => {
        if (slideIndex > 0) {
            setSlideIndex((i) => i - 1);
            setProgress(0);
            elapsedRef.current = 0;
        } else if (storyIndex > 0) {
            const prevStory = stories[storyIndex - 1];
            setStoryIndex((i) => i - 1);
            setSlideIndex(prevStory.slides.length - 1);
            setProgress(0);
            elapsedRef.current = 0;
        }
    }, [slideIndex, storyIndex, stories]);

    // Auto-advance timer
    useEffect(() => {
        if (isPaused || !currentSlide) return;

        startTimeRef.current = Date.now() - elapsedRef.current;

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const pct = Math.min(elapsed / SLIDE_DURATION, 1);
            setProgress(pct);

            if (pct >= 1) {
                goNext();
            }
        }, 30);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [storyIndex, slideIndex, isPaused, currentSlide, goNext]);

    // Pause on hold
    const handlePointerDown = () => {
        setIsPaused(true);
        elapsedRef.current = Date.now() - startTimeRef.current;
    };

    const handlePointerUp = () => {
        setIsPaused(false);
    };

    // Tap left/right navigation
    const handleTap = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 3) {
            goPrev();
        } else {
            goNext();
        }
    };

    // Swipe to close (drag down)
    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100) {
            onClose();
        }
    };

    // Close on escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [goNext, goPrev, onClose]);

    if (!currentStory || !currentSlide) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="relative w-full h-full max-w-[480px] mx-auto"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={0.3}
                    onDragEnd={handleDragEnd}
                >
                    {/* Progress bars */}
                    <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-2 pt-3">
                        {currentSlides.map((_, i) => (
                            <div key={i} className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-none"
                                    style={{
                                        width: i < slideIndex ? '100%' :
                                            i === slideIndex ? `${progress * 100}%` : '0%',
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Story header */}
                    <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-3">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
                                <img
                                    src={currentStory.cover_image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-white text-sm font-medium drop-shadow-lg">
                                {currentStory.title}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center text-white/80 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Slide image */}
                    <div
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                        onClick={handleTap}
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                    >
                        <motion.img
                            key={`${storyIndex}-${slideIndex}`}
                            src={currentSlide.image}
                            alt=""
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
