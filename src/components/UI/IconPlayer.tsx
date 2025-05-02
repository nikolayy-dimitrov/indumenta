import { useRef } from "react";
import { Player } from "@lordicon/react";

export const IconPlayer = ({ iconSrc, iconSize }: { iconSrc: object; iconSize: number }) => {
    const playerRef = useRef<Player>(null);

    const handleClick = () => {
        playerRef.current?.playFromBeginning();
    };

    return (
        <div onClick={handleClick}>
            <Player
                ref={playerRef}
                icon={iconSrc}
                size={iconSize}
            />
        </div>
    );
}