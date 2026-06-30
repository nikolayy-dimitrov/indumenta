import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface DatePickerProps {
    date: Date;
    onChange: (date: Date) => void;
    className?: string;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const DatePicker: React.FC<DatePickerProps> = ({ date, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date(date.getFullYear(), date.getMonth(), 1));
    const containerRef = useRef<HTMLDivElement>(null);

    // Update viewDate if external date prop changes significantly
    useEffect(() => {
        if (!isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
        }
    }, [date, isOpen]);

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleSelectDate = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Preserve time if needed, or just set to midnight
        onChange(newDate);
        setIsOpen(false);
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

    const isSameDate = (d1: Date, d2: Date) => {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const isToday = (day: number) => {
        return isSameDate(new Date(), new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    };

    const isSelected = (day: number) => {
        return isSameDate(date, new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
    };

    const isPastDate = (day: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dateToCheck = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return dateToCheck < today;
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 transition-colors text-primary"
            >
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-primary/40" />
                    <span className="font-medium tracking-wide">
                        {date.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>
            </button>

            {/* Popover / Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div 
                        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 
                                   md:absolute md:inset-auto md:top-full md:left-0 md:z-50 md:block md:bg-transparent md:backdrop-blur-none md:p-0 md:mt-2"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="w-[320px] max-w-full p-6 rounded-3xl bg-secondary border border-white/10 shadow-2xl 
                                       md:w-72 md:p-4 md:rounded-2xl md:bg-secondary/95 md:backdrop-blur-xl md:origin-top-left"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6 md:mb-4">
                                <button
                                    onClick={handlePrevMonth}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-primary/60 hover:text-primary transition-colors"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <div className="font-semibold text-lg text-primary tracking-wide">
                                    {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                                </div>
                                <button
                                    onClick={handleNextMonth}
                                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-primary/60 hover:text-primary transition-colors"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>

                            {/* Days of Week */}
                            <div className="grid grid-cols-7 mb-4">
                                {DAYS_OF_WEEK.map((day) => (
                                    <div key={day} className="text-center text-[10px] font-semibold text-primary/40 uppercase tracking-widest">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {/* Empty cells before the 1st */}
                                {Array.from({ length: firstDay }).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square" />
                                ))}
                                
                                {/* Days */}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const selected = isSelected(day);
                                    const today = isToday(day);
                                    const isPast = isPastDate(day);

                                    return (
                                        <button
                                            key={day}
                                            onClick={() => !isPast && handleSelectDate(day)}
                                            disabled={isPast}
                                            className={`aspect-square flex items-center justify-center rounded-full text-sm transition-all
                                                ${isPast 
                                                    ? 'text-primary/20 cursor-not-allowed'
                                                    : selected 
                                                        ? 'bg-primary text-secondary font-bold shadow-lg scale-110' 
                                                        : today 
                                                            ? 'bg-white/10 text-primary font-semibold border border-white/20' 
                                                            : 'text-primary/80 hover:bg-white/10 hover:text-primary hover:scale-110'
                                                }
                                            `}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Actions - Mobile Only */}
                            <div className="mt-6 pt-6 border-t border-white/10 flex justify-end md:hidden">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-6 py-2 rounded-xl border border-white/10 text-primary/60 hover:text-primary hover:bg-white/5 text-xs font-semibold uppercase tracking-[0.2em] transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
