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
    {key: "A", variants : ["A","'A","Ā","'Ā"]},
    {key: "E", variants : ["E","'E","Ē","'Ē"]},
    {key: "I", variants : ["I","'I","Ī","'Ī"]},
    {key: "O", variants : ["O","'O","Ō","'Ō"]},
    {key: "U", variants : ["U","'U","Ū","'Ū"]},
];

const consonnes = "FHMNPRTV".split('').map(letter => { return {key: letter, variants: [letter]}});

const enter = {key: "↵", variants : ["↵"]};
const backspace = {key: "⌫", variants: ["⌫"]};

export default function Keyboard(props: KeyboardProps) {

    const keyDownHandler = (e: KeyboardEvent) => {
        let key = e.key.toUpperCase();
        
        if (voyelles.find(v => v.key === key) || consonnes.find(v => v.key === key) || key === "ENTER" || key === "BACKSPACE") {
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
                            onKeyPressed={(char: string) => {if (props.gameState === 'RUNNING') props.onKeyChosen(char)}}></Key>
                    ))}
                <Key key={backspace.key}
                    letter={backspace}
                    onKeyPressed={(char: string) => {if (props.gameState === 'RUNNING') props.onKeyChosen(char)}}></Key>
            </div>
            <div className="flex flex-row justify-center gap-1 sm:gap-2">
                {consonnes.map((letter) => (
                    <Key key={letter.key}
                        letter={letter}
                        onKeyPressed={(char: string) => {if (props.gameState === 'RUNNING') props.onKeyChosen(char)}}></Key>
                ))}
                <Key key={enter.key}
                    letter={enter}
                    onKeyPressed={(char: string) => {if (props.gameState === 'RUNNING') props.onKeyChosen(char)}}></Key>
            </div>
        </div>
    );
}