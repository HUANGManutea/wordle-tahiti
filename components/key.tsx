import { useLongPress } from 'use-long-press';
import { Letter } from '../types/Letter';

type KeyProps = {
    letter: Letter,
    onKeyLongPressed: Function,
    onKeyPressed: Function,
};

export default function Key(props: KeyProps) {
    const bind = useLongPress(() => {
        props.onKeyLongPressed(props.letter);
    }, {
        onCancel: () => props.onKeyPressed(props.letter)
    });
    return (
        <button {...bind()} className="p-5 border-solid border-2 border-gray-300 rounded-md app-cell text-center active:bg-gray-300 active:text-black">{props.letter.key}</button>
    );
}