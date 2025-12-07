import { useState, useEffect, memo } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
}

/**
 * Optimized image component with:
 * - Progressive loading (blur placeholder → full image)
 * - Lazy loading by default
 * - Proper sizing attributes
 * - Memory efficient
 */
export const OptimizedImage = memo(({
                                        src,
                                        alt,
                                        className = '',
                                        width,
                                        height,
                                        loading = 'lazy',
                                        priority = false
                                    }: OptimizedImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState<string>('');
    const [error, setError] = useState(false);

    useEffect(() => {
        // Reset state when src changes
        setIsLoaded(false);
        setError(false);

        if (priority) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setCurrentSrc(src);
                setIsLoaded(true);
            };
            img.onerror = () => setError(true);
        } else {
            setCurrentSrc(src);
        }
    }, [src, priority]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setError(true);
    };

    if (error) {
        return (
            <div className={`${className} bg-gray-200 flex items-center justify-center`}>
                <span className="text-gray-400 text-sm">Failed to load</span>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Blur placeholder */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"/>
            )}

            <img
                src={currentSrc || src}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                className={`${className} transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                }}
            />
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if src or critical props change
    return prevProps.src === nextProps.src &&
        prevProps.className === nextProps.className;
});