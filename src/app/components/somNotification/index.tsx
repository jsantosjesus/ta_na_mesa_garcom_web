import { useEffect, useState } from "react";

type IParamsSoundPlayer = {
    src: string,
    snackBar: boolean
}

export const SoundPlayer = (params: IParamsSoundPlayer) => {
    const [audio] = useState(new Audio(params.src));


    useEffect(() => {
        if (params.snackBar) {
            audio.currentTime = 0;
            audio.play();
        }
    }, [audio, params.snackBar])

    return (
        <div
            style={{ display: 'none' }}
        >
            Play Sound
        </div>
    );
};