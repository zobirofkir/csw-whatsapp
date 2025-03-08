import { REACTIONS } from './types';

interface ReactionPickerProps {
    show: boolean;
    onReaction: (type: string) => void;
    userReaction?: string;
    pickerRef: React.RefObject<HTMLDivElement>;
    onMouseLeave: () => void;
}

export const ReactionPicker = ({ show, onReaction, userReaction, pickerRef, onMouseLeave }: ReactionPickerProps) => {
    if (!show) return null;

    return (
        <div
            ref={pickerRef}
            onMouseLeave={onMouseLeave}
            className="absolute bottom-full left-0 mb-2 flex space-x-1 rounded-full bg-white p-1 shadow-[0_0_8px_rgba(0,0,0,0.2)] transition-all duration-200 dark:bg-gray-700"
        >
            {Object.entries(REACTIONS).map(([type, emoji]) => (
                <button
                    key={type}
                    onClick={() => onReaction(type)}
                    className={`transform cursor-pointer rounded-full p-2 text-3xl transition hover:scale-125 ${
                        userReaction === type ? 'scale-110' : ''
                    }`}
                    title={type}
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};
