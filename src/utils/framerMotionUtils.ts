export const containerVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

export const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3,
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

export const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            delay: 0.1,
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            delay: 0.4,
            duration: 0.8,
            ease: "easeOut",
        },
    },
};

export const scaleUpVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

export const maskVariants = {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    visible: {
        opacity: 1,
        clipPath: "inset(0 0 0 0)",
        transition: { duration: 0.8, ease: "easeOut" },
    },
};
