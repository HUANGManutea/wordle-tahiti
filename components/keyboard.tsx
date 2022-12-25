import { Letter } from "../types/Letter";
import Key from "./key";
import React, { useEffect } from "react";

type KeyboardProps = {
    onKeyChosen: Function,
    gameState: string
};

interface KeyboardEvent {
    key: string;
}

const voyelles = [
    {key: "A", variants : ["A","Ā"]},
    {key: "E", variants : ["E","Ē"]},
    {key: "I", variants : ["I","Ī"]},
    {key: "O", variants : ["O","Ō"]},
    {key: "U", variants : ["U","Ū"]},
];

const eta = {key: "'", variants : ["'"]};

const consonnes = "FHMNPRTV".split('').map(letter => { return {key: letter, variants: [letter]}});

const enter = {key: "↵", variants : ["↵"]};
const backspace = {key: "⌫", variants: ["⌫"]};

const keyLongPressed = (letter: Letter) => {
    console.log(`letter long pressed: ${letter.key}`);
}

export default function Keyboard(props: KeyboardProps) {

    const keyDownHandler = (e: KeyboardEvent) => {
        let key = e.key.toUpperCase();
        
        if (voyelles.find(v => v.key === key) || consonnes.find(v => v.key === key) || key === eta.key || key === "ENTER" || key === "BACKSPACE") {
            if (key === "ENTER") {
                key = "↵";
            } else if (key === "BACKSPACE") {
                key = "⌫";
            }
            props.onKeyChosen(key);
        }
    }
    useEffect(() => {
        if (props.gameState === 'RUNNING') {
            document.addEventListener("keydown", keyDownHandler);
            return () => {
                document.removeEventListener("keydown", keyDownHandler);
            }
        }
    }, [props.gameState]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-center gap-1 sm:gap-2">
                {voyelles.map((letter) => (
                        <Key key={letter.key}
                            letter={letter}
                            onKeyLongPressed={(letter: Letter) => {if (props.gameState === 'RUNNING') keyLongPressed(letter)}}
                            onKeyPressed={(letter: Letter) => {if (props.gameState === 'RUNNING') props.onKeyChosen(letter.key)}}></Key>
                    ))}
                <Key key={eta.key}
                    letter={eta}
                    onKeyLongPressed={() => {}}
                    onKeyPressed={(letter: Letter) => {if (props.gameState === 'RUNNING') props.onKeyChosen(letter.key)}}></Key>
                <Key key={backspace.key}
                    letter={backspace} onKeyLongPressed={() => {}}
                    onKeyPressed={(letter: Letter) => {if (props.gameState === 'RUNNING') props.onKeyChosen(letter.key)}}></Key>
            </div>
            <div className="flex flex-row justify-center gap-1 sm:gap-2">
                {consonnes.map((letter) => (
                    <Key key={letter.key}
                        letter={letter}
                        onKeyLongPressed={() => {}}
                        onKeyPressed={(letter: Letter) => {if (props.gameState === 'RUNNING') props.onKeyChosen(letter.key)}}></Key>
                ))}
                <Key key={enter.key}
                    letter={enter}
                    onKeyLongPressed={() => {}}
                    onKeyPressed={(letter: Letter) => {if (props.gameState === 'RUNNING') props.onKeyChosen(letter.key)}}></Key>
            </div>
        </div>
    );
}