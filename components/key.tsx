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
        <button {...bind()} className="app-key">{props.letter.key}</button>
    );
}