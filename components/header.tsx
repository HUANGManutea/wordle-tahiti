import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Bars3Icon } from '@heroicons/react/24/outline'
import useTranslation from 'next-translate/useTranslation'

import Router from 'next/router'

type HeaderProps = {
    onHowToPlayClicked: Function,
    onSettingsClicked: Function,
    onDrawerClicked: Function,
}

export default function Header(props: HeaderProps) {
    const { t } = useTranslation('common');
    const title = t('title');

    const changeToLocale = (locale: string) => {
        Router.push('/', undefined, { locale: locale })
    }

    return (
        <div className="flex flex-row gap-5">
            <div className="sm:flex-1">
                <button onClick={() => props.onDrawerClicked()}>
                    <Bars3Icon className="h-10"></Bars3Icon>
                </button>
            </div>
            <div className="flex flex-col flex-grow justify-center sm:text-center">
                <h1>{title}</h1>
            </div>
            <div className="flex flex-row sm:flex-1 justify-end items-center gap-3">
                <div className='flex flex-row gap-2'>
                    <button onClick={() => changeToLocale('ty')}>
                        <span className="h-8 w-8 fi fi-pf"></span>
                    </button>
                    <button onClick={() => changeToLocale('fr')}>
                        <span className="h-8  w-8 fi fi-fr"></span>
                    </button>
                </div>
                <button className="px-3 py-2 leading-1 border-solid border-2 rounded-md border-gray-300" onClick={() => props.onHowToPlayClicked()}>?</button>
                <button onClick={() => props.onSettingsClicked()}>
                    <Cog6ToothIcon className="h-10"></Cog6ToothIcon>
                </button>
            </div>
        </div>
    )
}