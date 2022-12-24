import React, { useState } from "react";

type ModalProps = {
    text?: string,
    isHidden: boolean,
    onSuccessClick: Function
}

export default function Modal(props: ModalProps) {
    const baseClassName = "fixed inset-0 flex flex-col justify-center items-center bg-gray-500 bg-opacity-50 z-50";
    if (!props.text) return <></>;
    return (
        <div className={props.isHidden ? `${baseClassName} hidden` : baseClassName}>
            <div className="p-5 flex flex-col h-1/2 w-1/4 rounded-md border-solid border-2 border-gray-300 bg-gray-700">
                <div className="flex flex-col flex-grow text-center justify-center">
                    <p>{props.text}</p>
                </div>
                <div className="flex flex-row justify-center">
                    <button onClick={() => props.onSuccessClick()} className="p-3 border-solid border-2 border-green-300 text-green-300 rounded-md">Mauruuru !</button>
                </div>
            </div>
        </div>
    )
}