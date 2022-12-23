import { Letter } from "../types/Letter";
import Key from "./key";

type KeyboardProps = {
    onKeyChosen: Function,
    won: boolean
};

const voyelles = [
    {key: "A", variants : ["A","Ā"]},
    {key: "E", variants : ["E","Ē"]},
    {key: "I", variants : ["I","Ī"]},
    {key: "O", variants : ["O","Ō"]},
    {key: "U", variants : ["U","Ū"]},
];

const consonnes = "FHMNPRTV'".split('').map(letter => { return {key: letter, variants: [letter]}});

const keyLongPressed = (letter: Letter) => {
    console.log(`letter long pressed: ${letter.key}`);
}

export default function Keyboard(props: KeyboardProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="grid grid-cols-9 grid-rows-1 gap-2">
                <div className="col-start-2"></div>
                {voyelles.map((letter) => (
                        <Key key={letter.key} letter={letter} onKeyLongPressed={(letter: Letter) => {if (!props.won) keyLongPressed(letter)}} onKeyPressed={(letter: Letter) => {if (!props.won) props.onKeyChosen(letter.key)}}></Key>
                    ))}
            </div>
            <div className="grid grid-cols-9 grid-rows-1 gap-2">
                {consonnes.map((letter) => (
                    <Key key={letter.key} letter={letter} onKeyLongPressed={() => {}} onKeyPressed={(letter: Letter) => {if (!props.won) props.onKeyChosen(letter.key)}}></Key>
                ))}
            </div>
            
            
        </div>
    );
}