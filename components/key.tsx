import { useEffect, useState } from 'react';
import { LongPressEvent, useLongPress } from 'use-long-press';
import { Letter } from '../types/Letter';

type KeyProps = {
    letter: Letter,
    onKeyPressed: Function,
};

export default function Key(props: KeyProps) {
    const [popoverContentClassName, setPopoverContentClassName] = useState('popover-content');
    const [isPopoverContentActive, setIsPopoverActive] = useState(false);

    const bind = useLongPress(() => {
        setIsPopoverActive(!isPopoverContentActive);
    }, {
        onCancel: () => props.onKeyPressed(props.letter.key),
        onMove: (event: LongPressEvent<Element>) => {
            const baseEvent = event as any;
            if (baseEvent.type === "touchmove") {
                if (baseEvent.changedTouches?.length > 0) {
                    const appVariantKeys = Array.from(event.currentTarget.getElementsByClassName('app-variant-key'));
                    const currentTarget = document.elementFromPoint(baseEvent.changedTouches[0].clientX, baseEvent.changedTouches[0].clientY);
                    appVariantKeys.forEach(element => {
                        if (element === currentTarget) {
                            element.classList.add('app-variant-key-active');
                        } else {
                            element.classList.remove('app-variant-key-active');

                        }
                    });
                }
            }
        },
        onFinish: (event: LongPressEvent<Element>) => {
            // sorry, it's hideous but sliding over the screen and getting the right key on the popover is asking for hideous
            const baseEvent = event as any;
            if (baseEvent.type === "mouseup") {
                //mouse event
                // get the element where the cursor is
                const finalTarget = document.elementFromPoint(baseEvent.clientX, baseEvent.clientY);
                // trigger only if we still are in the parent div
                if (finalTarget && baseEvent.currentTarget.contains(finalTarget)) {
                    // emit the value of the key where the cursor is
                    props.onKeyPressed((finalTarget as any).value);
                }
            }
            if (baseEvent.type === "touchend") {
                // touch event
                // trigger only if we slided the finger
                if (baseEvent.changedTouches?.length > 0) {
                    // get the element where the finger is
                    const finalTarget = document.elementFromPoint(baseEvent.changedTouches[0].clientX, baseEvent.changedTouches[0].clientY);
                    // trigger only if we still are in the parent div
                    if (finalTarget && baseEvent.currentTarget.contains(finalTarget)) {
                        // emit the value of the key where the finger is
                        props.onKeyPressed((finalTarget as any).value);
                    }
                }
            }
            
            setIsPopoverActive(!isPopoverContentActive)
        },
        cancelOnMovement: false,
        captureEvent: true,
    });

    useEffect(() => {
        if (isPopoverContentActive) {
            setPopoverContentClassName('popover-content popover-content-active');
        } else {
            setPopoverContentClassName('popover-content');
        }
    }, [isPopoverContentActive]);

    useEffect(() => {
        const variantA = document.getElementById("key-variant-A");
        if (variantA) {
            variantA.addEventListener("", (event: any) => {
                console.log(event);
            })
        }
    })

    if (props.letter.variants.length > 1) {
        return (
            <div {...bind()} className="inline-flex relative popover-wrapper">
                <button className="app-key after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:border-gray-300 after:border-b after:border-l after:h-3 after:w-3">
                    {props.letter.key}
                </button>
                <div id={`popover-key-${props.letter.key}`} className={popoverContentClassName}>
                    <div className='flex flex-row'>
                        {props.letter.variants.map((variant, index) => (
                            <button
                                id={`key-variant-${variant}`} 
                                key={`key-variant-${variant}`}
                                value={variant}
                                className='app-variant-key'>
                                    {variant}
                            </button>
                        ))}
                    </div>
                    <div data-popper-arrow></div>
                </div>
            </div>
        );
    } else {
        return (
            <button onClick={() => props.onKeyPressed(props.letter.key)} value={props.letter.key} className="app-key">{props.letter.key}</button>
        );
    }
}