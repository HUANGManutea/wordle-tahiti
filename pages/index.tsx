import Head from 'next/head'
import Board from '../components/board'
import Keyboard from '../components/keyboard'
import React, { useState, useEffect } from "react";
import Modal from '../components/modal';
import { Data } from './api/word';
import Header from '../components/header';
import { Theme } from '../lib/theme';
import Tile from '../components/tile';
import Drawer from '../components/drawer';
import { CodeBracketIcon, BookOpenIcon, PencilSquareIcon, UserGroupIcon } from '@heroicons/react/24/solid'
import useTranslation from 'next-translate/useTranslation'

type HomeProps = {
  word: string
}

const defaultTheme: Theme = {
  valid: "#22C55E",
  invalid: "#EF4444",
  misplaced: "#EAB308",
  bgValid: "bg-green-500",
  bgInvalid: "bg-red-500",
  bgMisplaced: "bg-yellow-500",
  borderValid: "border-green-500",
  textValid: "text-green-500",
}

const colorblindTheme: Theme = {
  valid: "#648FFF",
  invalid: "#DC267F",
  misplaced: "#FFB000",
  bgValid: "bg-[#648FFF]",
  bgInvalid: "bg-[#DC267F]",
  bgMisplaced: "bg-[#FFB000]",
  borderValid: "border-[#648FFF]",
  textValid: "text-[#648FFF]",
}

export async function getServerSideProps() {
  const res = await fetch(`${process.env.BASE_URL}/api/word`);
  const data: Data = await res.json();
  return {props: {word: data.word}};
}

export default function Home(props: HomeProps) {
  const wordLength = 5;
  const tries = 5;
  const [tentatives, setTentatives] = useState<Array<string>>(Array(tries).fill("     "));
  const [currentTentative, setCurrentTentative] = useState("");
  const [tentativeIndex, setTentativeIndex] = useState(0);
  const [gameState, setGameState] = useState("RUNNING");
  const [selectedKey, setSelectedKey] = useState("");
  const [isModalResultHidden, setIsModalResultHidden] = useState(true);
  const [isModalResultShown, setIsModalResultShown] = useState(false);
  const [modalResultText, setModalResultText] = useState("");
  const [isModalHowToHidden, setIsModalHowToHidden] = useState(true);
  const [isModalSettingsHidden, setIsModalSettingsHidden] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const { t } = useTranslation('home');

  const drawerTranslations = {
    aboutTitle: t('drawerAboutTitle'),
    aboutContent: t('drawerAboutContent'),
    thanksTitle: t('drawerThanksTitle'),
    thanksContent1: t('drawerThanksContent1'),
    thanksContent2: t('drawerThanksContent2'),
    licenceTitle: t('drawerLicenceTitle'),
    licenceContent: t('drawerLicenceContent'),
    seeMoreTitle: t('drawerSeeMoreTitle'),
    tahitiDevOps: t('drawerTahitiDevOps'),
    STI: t('drawerSTI'),
    myBlog: t('drawerMyBlog'),
    myGithub: t('drawerMyGithub'),
    sourceCode: t('drawerSourceCode')
  };

  const settingsTranslations = {
    colorbindMode: t('settingsColorbindMode')
  };

  const howToTranslations = {
    rulesTitle: t('howToRulesTitle'),
    rulesContent1: t('howToRulesContent1'),
    rulesContent2: t('howToRulesContent2'),
    rulesContent3: t('howToTulesContent3'),
    inputTitle: t('howToInputTitle'),
    inputContent: t('howToInputContent'),
    gameTitle: t('howToGameTitle'),
    gameContent1: t('howToGameContent1'),
    gameContent2: t('howToGameContent2'),
    gameExample1: t('howToGameExample1'),
    gameExample2: t('howToGameExample2'),
    gameExample3: t('howToGameExample3'),
  }



  const onKeyChosen = (char: string) => {
    setSelectedKey(char);
  }

  const onCheckedColorblind = (isColorblind: boolean) => {
    if (isColorblind) {
      setTheme(colorblindTheme);
    } else {
      setTheme(defaultTheme);
    }
  }

  const onHowToPlayClicked = () => {
    setIsModalHowToHidden(false);
  }

  const onSettingsClicked = () => {
    setIsModalSettingsHidden(false);
  }

  const onDrawerClicked = () => {
    setIsDrawerOpen(true);
  }

  useEffect(() => {
    if (gameState === 'WIN' && !isModalResultShown) {
      setTimeout(() => {
        setModalResultText("Bravo !");
        setIsModalResultHidden(false);
        setIsModalResultShown(true);
      }, 100)
    } else if (gameState === 'LOSE' && !isModalResultShown) {
      setTimeout(() => {
        setModalResultText(`La bonne réponse était: ${props.word}`);
        setIsModalResultHidden(false);
        setIsModalResultShown(true);
      }, 100)
    }
  }, [gameState, tentativeIndex, tentatives, isModalResultShown]);

  useEffect(() => {
    if (selectedKey != "") {
      if (selectedKey === '↵') {
        if (currentTentative.length === wordLength && tentativeIndex < tentatives.length) {
          const copyCurrentTentative = `${currentTentative}`; 
          const copyTentatives = JSON.parse(JSON.stringify(tentatives));
          copyTentatives[tentativeIndex] = copyCurrentTentative;
          setTentatives(copyTentatives);
          setCurrentTentative("");
          setTentativeIndex(tentativeIndex + 1);
          if (copyCurrentTentative === props.word) {
            setGameState("WIN");
          } else {
            if (tentativeIndex === tentatives.length - 1) {
              setGameState("LOSE");
            }
          }
        }
      } else if (selectedKey === "⌫") {
        if (currentTentative.length > 0) {
          setCurrentTentative(currentTentative.slice(0, currentTentative.length - 1));
        }
      } else  {
        if (currentTentative.length < wordLength) {
          setCurrentTentative(`${currentTentative}${selectedKey}`);
        }
      }
      setSelectedKey("");
    }
  }, [tentativeIndex, selectedKey, tentatives]);

  if (props.word == null || props.word === "") return <div>Récupération du mot...</div>;

  return (
    <>
      <Head>
        <title>Wordle Tahiti</title>
        <meta name="description" content="Wordle Tahiti" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col justify-between min-h-screen m-auto p-5 sm:p-20 gap-5'>
          <Header onHowToPlayClicked={onHowToPlayClicked} onSettingsClicked={onSettingsClicked} onDrawerClicked={onDrawerClicked}></Header>
          <Board theme={theme} word={props.word} tries={tries} wordLength={wordLength} tentatives={tentatives} currentTentative={currentTentative}></Board>
          <Keyboard gameState={gameState} onKeyChosen={(char: string) => onKeyChosen(char)}></Keyboard>
      </div>
      <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen}>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-3'>
            <h2>{drawerTranslations.aboutTitle}</h2>
            <p>{drawerTranslations.aboutContent}</p>
            <h2>{drawerTranslations.thanksTitle}</h2>
            <p>{drawerTranslations.thanksContent1}</p>
            <p>{drawerTranslations.thanksContent2}</p>
            <h2>{drawerTranslations.licenceTitle}</h2>
            <p>{drawerTranslations.licenceContent}</p>
            <h2>{drawerTranslations.seeMoreTitle}</h2>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row gap-1 items-center'>
                <UserGroupIcon className='h-5'></UserGroupIcon>
                <a className={theme.textValid} href="https://tahiti.dev/" target="_blank">{drawerTranslations.tahitiDevOps}</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <BookOpenIcon className='h-5'></BookOpenIcon>
                <a className={theme.textValid} href="https://www.service-public.pf/voir/annuaire/sti-service-de-la-traduction-et-de-linterpretariat/" target="_blank">{drawerTranslations.STI}</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <PencilSquareIcon className='h-5'></PencilSquareIcon>
                <a className={theme.textValid} href="https://huangmanutea.github.io/blog.dev/" target="_blank">{drawerTranslations.myBlog}</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path></svg>
                <a className={theme.textValid} href="https://github.com/HUANGManutea" target="_blank">{drawerTranslations.myGithub}</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <CodeBracketIcon className='h-5'></CodeBracketIcon>
                <a className={theme.textValid} href="https://github.com/HUANGManutea/wordle-tahiti" target="_blank">{drawerTranslations.sourceCode}</a>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <Modal theme={theme} isHidden={isModalResultHidden} setIsHidden={setIsModalResultHidden}>
        <div className='flex flex-grow justify-center items-center text-center'>
          <p>{modalResultText}</p>
        </div>
      </Modal>
      <Modal theme={theme} isHidden={isModalSettingsHidden} setIsHidden={setIsModalSettingsHidden}>
        <div className='flex flex-col gap-3'>
          <div className="flex items-center">
              <label className="inline-flex relative cursor-pointer m-3">
                  <input type="checkbox" value="" className="sr-only peer" onChange={(event) => event.target.checked ? onCheckedColorblind(true) : onCheckedColorblind(false)}/>
                  <div className="w-11 h-6 outline-white bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-white">{settingsTranslations.colorbindMode}</span>
              </label>
          </div>
        </div>
      </Modal>
      <Modal isHidden={isModalHowToHidden} setIsHidden={setIsModalHowToHidden} theme={theme}>
        <div>
            <h2>{howToTranslations.rulesTitle}</h2>
            <p>{howToTranslations.rulesContent1}</p>
            <p>{howToTranslations.rulesContent2}</p>
            <p>{howToTranslations.rulesContent3}</p>
            <br/>
        </div>
        <div>
            <h2>{howToTranslations.inputTitle}</h2>
            <p>{howToTranslations.inputContent}</p>
            <br/>
        </div>
        <div>
            <h2>{howToTranslations.gameTitle}</h2>
            <p>{howToTranslations.gameContent1}</p>
            <p>{howToTranslations.gameContent2}</p>
            <br/>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-5 items-center">
                    <Tile theme={theme} character={"A"} valid={1}></Tile>
                    <p>{howToTranslations.gameExample1}</p>
                </div>
                <div className="flex flex-row gap-5 items-center">
                    <Tile theme={theme} character={"A"} valid={2}></Tile>
                    <p>{howToTranslations.gameExample2}</p>
                </div>
                <div className="flex flex-row gap-5 items-center">
                    <Tile theme={theme} character={"A"} valid={3}></Tile>
                    <p>{howToTranslations.gameExample3}</p>
                </div>
            </div>
        </div>
      </Modal>
    </>
  )
}
