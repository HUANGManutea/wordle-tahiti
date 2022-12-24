import React, { useState } from "react";
import { Theme } from "../lib/theme";

type ModalProps = {
    text?: string,
    isHidden: boolean,
    onSuccessClick: Function,
    theme: Theme
}

export default function Modal(props: ModalProps) {
    const modalBaseClassName = "fixed inset-0 flex flex-col justify-center items-center bg-gray-500 bg-opacity-50 z-50";
    const buttonBaseClassName = "p-3 border-solid border-2 rounded-md";
    if (!props.text) return <></>;
    return (
        <div className={props.isHidden ? `${modalBaseClassName} hidden` : modalBaseClassName}>
            <div className="p-5 flex flex-col h-1/2 w-1/4 rounded-md border-solid border-2 border-gray-300 bg-gray-700">
                <div className="flex flex-col flex-grow text-center justify-center">
                    <p>{props.text}</p>
                </div>
                <div className="flex flex-row justify-center">
                    <button onClick={() => props.onSuccessClick()} className={`${buttonBaseClassName} ${props.theme.borderValid} ${props.theme.textValid}`}>Mauruuru !</button>
                </div>
            </div>
        </div>
    )
}