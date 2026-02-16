'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StoryViewer from './StoryViewer';

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

interface StoriesRowProps {
    stories: Story[];
}

export default function StoriesRow({ stories }: StoriesRowProps) {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [activeStoryIndex, setActiveStoryIndex] = useState(0);
    const [seenIds, setSeenIds] = useState<Set<number>>(new Set());

    if (!stories || stories.length === 0) return null;

    const handleStoryClick = (index: number) => {
        setActiveStoryIndex(index);
        setViewerOpen(true);
        setSeenIds((prev) => new Set([...prev, stories[index].id]));
    };

    const handleViewerClose = () => {
        // Mark all viewed stories as seen
        setSeenIds((prev) => {
            const next = new Set(prev);
            for (let i = 0; i <= activeStoryIndex; i++) {
                next.add(stories[i].id);
            }
            return next;
        });
        setViewerOpen(false);
    };

    return (
        <>
            <div className="px-4 py-4">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                    {stories.map((story, index) => {
                        const isSeen = seenIds.has(story.id);
                        return (
                            <motion.button
                                key={story.id}
                                className="flex flex-col items-center gap-1.5 shrink-0"
                                onClick={() => handleStoryClick(index)}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div
                                    className={`w-[68px] h-[68px] rounded-full p-[3px] ${isSeen
                                        ? 'bg-gray-300'
                                        : 'bg-gradient-to-tr from-[var(--primary)] via-pink-500 to-orange-400'
                                        }`}
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden border-[2.5px] border-white bg-white">
                                        <img
                                            src={story.cover_image}
                                            alt={story.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <span className="text-[11px] text-[var(--text-secondary)] max-w-[68px] truncate text-center leading-tight">
                                    {story.title}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {viewerOpen && (
                <StoryViewer
                    stories={stories}
                    initialStoryIndex={activeStoryIndex}
                    onClose={handleViewerClose}
                />
            )}
        </>
    );
}
