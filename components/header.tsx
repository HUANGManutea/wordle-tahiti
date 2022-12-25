import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/outline'

type HeaderProps = {
    onHowToPlayClicked: Function,
    onSettingsClicked: Function,
    onDrawerClicked: Function,
}

export default function Header(props: HeaderProps) {
    return (
        <div className="flex flex-row gap-5">
            <div className="sm:flex-1">
                <button onClick={() => props.onDrawerClicked()}>
                    <Bars3Icon className="h-10"></Bars3Icon>
                </button>
            </div>
            <div className="flex flex-col flex-grow justify-center sm:text-center">
                <h1>Wordle Tahiti</h1>
            </div>
            <div className="flex flex-row sm:flex-1 justify-end items-center gap-3">
                <button className="px-3 py-2 leading-1 border-solid border-2 rounded-md border-gray-300" onClick={() => props.onHowToPlayClicked()}>?</button>
                <button onClick={() => props.onSettingsClicked()}>
                    <Cog6ToothIcon className="h-10"></Cog6ToothIcon>
                </button>
            </div>
        </div>
    )
}