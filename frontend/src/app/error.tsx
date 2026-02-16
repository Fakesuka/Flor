'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Strings } from '@/lib/strings';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                {Strings.errorGeneral}
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-md">
                {error.message || 'Произошла непредвиденная ошибка.'}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="default">
                    {Strings.retry}
                </Button>
                <Button onClick={() => window.location.href = '/'} variant="outline">
                    На главную
                </Button>
            </div>
        </div>
    );
}
