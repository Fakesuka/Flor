export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            {/* Pulsing flower icon */}
            <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] animate-ping absolute inset-0 opacity-20" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary-light)] to-[var(--primary)] flex items-center justify-center relative">
                    <span className="text-2xl">🌸</span>
                </div>
            </div>

            <p
                className="text-sm text-[var(--text-secondary)] animate-pulse"
                style={{ fontFamily: 'var(--font-body)' }}
            >
                Загрузка...
            </p>
        </div>
    );
}
