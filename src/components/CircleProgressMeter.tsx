interface CircleMeterProps {
    used: number;
    total: number;
    size?: number;
    strokeWidth?: number;
    circleClass?: string;
    trackClass?: string;
    title: string;
}

export function CircleMeter({
                                used,
                                total,
                                title,
                                size = 100,
                                strokeWidth = 8,
                                circleClass = 'text-primary',
                                trackClass = 'text-black/30',
                            }: CircleMeterProps) {
    const percentage = Math.min(100, (used / total) * 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percentage / 100);

    return (
        <svg
            width={size}
            height={size}
            className="transform -rotate-90"
            style={{ overflow: 'visible' }}
        >
            {/* Track */}
            <circle
                stroke="currentColor"
                className={trackClass}
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            {/* Progress */}
            <circle
                stroke="currentColor"
                className={circleClass}
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            {/* Centered Text */}
            <text
                x="50%"
                y="-50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-xs font-light rotate-90 fill-current flex flex-col"
            >
                <tspan
                    x="50%"
                    dy="-0.6em"
                >
                    {title}
                </tspan>
                <tspan
                    x="50%"
                    dy="1.2em"
                >
                    {used} / {total}
                </tspan>
            </text>
        </svg>
    );
}
