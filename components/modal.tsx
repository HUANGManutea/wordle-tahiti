import { Theme } from "../lib/theme";
import React, { useEffect, useState } from 'react';

type ModalProps = {
    isHidden: boolean,
    setIsHidden: Function,
    theme: Theme,
    children: any
}

export default function Modal(props: ModalProps) {
    const [modalClassName, setModalClassName] = useState('app-modal');

    const onSuccessClick = () => {
        props.setIsHidden(!props.isHidden);
    }
    
    useEffect(() => {
        if (props.isHidden) {
            setModalClassName('hidden');
        } else {
            setModalClassName('app-modal');
        }
    }, [props.isHidden, modalClassName])

    if (!props.children) return <></>;
    return (
        <div className={modalClassName}>
            <div className="app-modal-content">
                <div className="flex flex-col flex-grow overflow-y-auto pb-2">
                    {props.children}
                </div>
                <div className="flex flex-row justify-center">
                    <button onClick={onSuccessClick} className={`app-button ${props.theme.borderValid} ${props.theme.textValid}`}>Māuruuru !</button>
                </div>
            </div>
        </div>
    )
}