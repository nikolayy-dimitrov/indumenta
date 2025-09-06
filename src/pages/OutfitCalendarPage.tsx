import { useContext, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";

import { OutfitItem } from "../types/wardrobe.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import { useScheduledOutfits } from "../hooks/useWardrobe.ts";
import { OutfitModal } from "../components/UI/OutfitModal.tsx";

export const OutfitCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [scheduledOutfitsByDate, setScheduledOutfitsByDate] = useState<Record<string, OutfitItem[]>>({});
    const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);

    const { user } = useContext(AuthContext);
    const { scheduledOutfits } = useScheduledOutfits(user!.uid);

    useEffect(() => {
        if (!scheduledOutfits || scheduledOutfits.length === 0) return;

        const outfitsByDate: Record<string, OutfitItem[]> = {};

        scheduledOutfits.forEach(scheduledOutfits => {
            if (scheduledOutfits.scheduledDate) {
                const date = scheduledOutfits.scheduledDate.toDate();
                const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

                if (!outfitsByDate[dateKey]) {
                    outfitsByDate[dateKey] = [];
                }

                outfitsByDate[dateKey].push(scheduledOutfits);
            }
        });

        setScheduledOutfitsByDate(outfitsByDate);
    }, [scheduledOutfits]);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getPrevMonthDays = (year: number, month: number) => {
        const firstDay = getFirstDayOfMonth(year, month);
        if (firstDay === 0) return [];

        const prevMonth = month === 0 ? 11 : month - 1;
        const prevMonthYear = month === 0 ? year - 1 : year;
        const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

        const prevMonthDays = [];
        for (let i = 0; i < firstDay; i++) {
            prevMonthDays.unshift({
                day: daysInPrevMonth - i,
                month: prevMonth,
                year: prevMonthYear,
                isCurrentMonth: false
            });
        }

        return prevMonthDays;
    };

    const getNextMonthDays = (year: number, month: number) => {
        const daysInMonth = getDaysInMonth(year, month);
        const lastDay = new Date(year, month, daysInMonth).getDay();
        if (lastDay === 6) return [];

        const nextMonth = month === 11 ? 0 : month + 1;
        const nextMonthYear = month === 11 ? year + 1 : year;

        const nextMonthDays = [];
        for (let i = 1; i <= 6 - lastDay; i++) {
            nextMonthDays.push({
                day: i,
                month: nextMonth,
                year: nextMonthYear,
                isCurrentMonth: false
            });
        }

        return nextMonthDays;
    };

    const getCurrentMonthDays = (year: number, month: number) => {
        const daysInMonth = getDaysInMonth(year, month);
        const days = [];

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: month,
                year: year,
                isCurrentMonth: true
            });
        }

        return days;
    };

    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        return [
            ...getPrevMonthDays(year, month),
            ...getCurrentMonthDays(year, month),
            ...getNextMonthDays(year, month)
        ];
    };

    const getDayOfWeek = (year: number, month: number, day: number) => {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        return weekDays[dayOfWeek];
    };

    const getOutfitsForDate = (year: number, month: number, day: number) => {
        const dateKey = `${year}-${month}-${day}`;
        return scheduledOutfitsByDate[dateKey] || [];
    };

    const goToPrevMonth = () => {
        setCurrentDate(prev => {
            const prevMonth = new Date(prev);
            prevMonth.setMonth(prev.getMonth() - 1);
            return prevMonth;
        });
    };

    const goToNextMonth = () => {
        setCurrentDate(prev => {
            const nextMonth = new Date(prev);
            nextMonth.setMonth(prev.getMonth() + 1);
            return nextMonth;
        });
    };

    const calendarDays = getCalendarDays();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen font-Josefin">
                <Link to="/authentication">Please log in to view your outfit calendar.</Link>
            </div>
        );
    }

    return (
        <div className="h-[90vh] w-full p-4 flex flex-col">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
                <motion.button
                    className="p-2 flex items-center gap-2 text-primary font-semibold transition duration-300
                    hover:text-primary-yellow hover:bg-primary/10 rounded active:scale-90"
                    onClick={goToPrevMonth}
                >
                    <FontAwesomeIcon icon={faCircleChevronLeft} size={'sm'}/>
                    <span className="tracking-wide">Previous</span>
                </motion.button>

                <h2 className="text-2xl font-bold text-primary tracking-wider">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>

                <motion.button
                    className="p-2 flex items-center gap-2 text-primary font-semibold transition duration-300
                    hover:text-primary-yellow hover:bg-primary/10 rounded active:scale-90"
                    onClick={goToNextMonth}
                >
                    <span className="tracking-wide">Next</span>
                    <FontAwesomeIcon icon={faCircleChevronRight} size={'sm'}/>
                </motion.button>
            </div>
            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col md:border-2 border-primary rounded-lg p-1">
                {/* Calendar days */}
                <div
                    className="grid md:grid-cols-7 max-md:grid-cols-2 flex-1 auto-rows-fr gap-2 p-2">
                    {calendarDays.map((dayInfo, index) => {
                        const dayOfWeek = getDayOfWeek(dayInfo.year, dayInfo.month, dayInfo.day);
                        const dayOutfits = getOutfitsForDate(dayInfo.year, dayInfo.month, dayInfo.day);

                        const today = new Date();
                        const isToday =
                            today.getDate() === dayInfo.day &&
                            today.getMonth() === dayInfo.month &&
                            today.getFullYear() === dayInfo.year;

                        return (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`py-1 px-2 rounded-lg border hover:scale-105 ${isToday ? 'border-content/90 border-2' : 'border-primary'} min-h-20 
                                ${dayInfo.isCurrentMonth ? 'bg-secondary' : 'opacity-25'}`}>
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between p-0.5">
                                        <span
                                            className={`text-right text-sm font-medium ${dayInfo.isCurrentMonth ? 'text-primary' : 'text-primary/60'}`}>
                                            {dayInfo.day}
                                        </span>
                                        <span className="text-xs text-left">{dayOfWeek}</span>
                                    </div>
                                    {/* Display scheduled outfits */}
                                    <div className="flex-1 overflow-y-auto">
                                        {dayOutfits.map((outfit, idx) => (
                                            <motion.div
                                                key={idx}
                                                onClick={() => setSelectedOutfit(outfit)}
                                                className="p-1 mx-4 mb-1 bg-primary/10 rounded text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {outfit.label ? (
                                                    <div
                                                        className="flex items-center justify-center">
                                                        <span
                                                            className="font-semibold tracking-wider">{outfit.label}</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {outfit.outfitPieces && (
                                                            <div
                                                                className="flex items-center justify-center gap-1">
                                                                <div
                                                                    className="w-6 h-6 rounded-sm overflow-hidden">
                                                                    <img
                                                                        src={outfit.outfitPieces.Top}
                                                                        alt="Top"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div
                                                                    className="w-6 h-6 rounded-sm overflow-hidden">
                                                                    <img
                                                                        src={outfit.outfitPieces.Bottom}
                                                                        alt="Bottom"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div
                                                                    className="w-6 h-6 rounded-sm overflow-hidden">
                                                                    <img
                                                                        src={outfit.outfitPieces.Shoes}
                                                                        alt="Shoes"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Outfit Modal */}
            {selectedOutfit && (
                <OutfitModal
                    outfit={selectedOutfit}
                    onClose={() => setSelectedOutfit(null)}
                    isOwner={user?.uid === selectedOutfit.userId}
                />
            )}
        </div>
    );
};