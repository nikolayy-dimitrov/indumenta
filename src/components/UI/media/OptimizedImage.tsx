import { useState, useEffect, memo, useRef } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    loading?: 'lazy' | 'eager';
    priority?: boolean;
}

const imageCache = new Map<string, HTMLImageElement>();
const loadingCache = new Set<string>();

/**
 * Preload an image and cache it
 */
const preloadImage = (src: string): Promise<HTMLImageElement> => {
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src)!);
    }

    // Return existing promise if already loading
    if (loadingCache.has(src)) {
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (imageCache.has(src)) {
                    clearInterval(checkInterval);
                    resolve(imageCache.get(src)!);
                }
            }, 50);

            setTimeout(() => {
                clearInterval(checkInterval);
                reject(new Error('Image load timeout'));
            }, 10000);
        });
    }

    loadingCache.add(src);

    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
            imageCache.set(src, img);
            loadingCache.delete(src);
            resolve(img);
        };

        img.onerror = () => {
            loadingCache.delete(src);
            reject(new Error(`Failed to load image: ${src}`));
        };

        img.src = src;
    });
};

/**
 * Optimized image component
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
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Reset state when src changes
        setIsLoaded(false);
        setError(false);

        if (imageCache.has(src)) {
            setCurrentSrc(src);
            setIsLoaded(true);
            return;
        }

        if (priority || loading === 'eager') {
            preloadImage(src)
                .then(() => {
                    setCurrentSrc(src);
                    setIsLoaded(true);
                })
                .catch(() => setError(true));
            return;
        }

        if (imgRef.current) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            preloadImage(src)
                                .then(() => {
                                    setCurrentSrc(src);
                                    setIsLoaded(true);
                                })
                                .catch(() => setError(true));

                            // Disconnect after loading
                            if (observerRef.current) {
                                observerRef.current.disconnect();
                            }
                        }
                    });
                },
                {
                    rootMargin: '50px',
                    threshold: 0.01,
                }
            );

            observerRef.current.observe(imgRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [src, priority, loading]);

    if (error) {
        return (
            <div
                ref={imgRef}
                className={`${className} bg-gray-200 flex items-center justify-center`}
                style={{ width, height }}
            >
                <span className="text-gray-400 text-sm">Failed to load</span>
            </div>
        );
    }

    // const handleLoad = () => {
    //     setIsLoaded(true);
    // };
    //
    // const handleError = () => {
    //     setError(true);
    // };
    //
    // if (error) {
    //     return (
    //         <div className={`${className} bg-gray-200 flex items-center justify-center`}>
    //             <span className="text-gray-400 text-sm">Failed to load</span>
    //         </div>
    //     );
    // }

    return (
        <div className={`relative ${className}`}>
            {/* Blur placeholder */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-gray-200 animate-pulse"
                    style={{ width, height }}
                />
            )}

            <img
                ref={imgRef}
                src={currentSrc || undefined}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                className={`transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if src or critical props change
    return prevProps.src === nextProps.src &&
        prevProps.className === nextProps.className;
});