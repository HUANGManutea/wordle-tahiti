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
            <h2>A propos</h2>
            <p>Ce site a été développé par HUANG Manutea en partenariat avec l'association Tahiti DevOps et l'Académie Tahitienne (Fare Vanaa).</p>
            <h2>Remerciements</h2>
            <p>Je remercie l'association Tahiti DevOps pour leur engouement et pour avoir contacté l'Académie Tahitienne.</p>
            <p>Je remercie l'Académie Tahitienne pour m'avoir fourni la liste des mots de 5 lettres du dictionnaire Tahitien.</p>
            <h2>Licence</h2>
            <p>Ce site n'a aucun but lucratif. Le code source de ce site ainsi que la liste des mots sont sous licence Creative Common.</p>
            <h2>En savoir plus</h2>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row gap-1 items-center'>
                <UserGroupIcon className='h-5'></UserGroupIcon>
                <a className={theme.textValid} href="https://tahiti.dev/" target="_blank">L'association Tahiti DevOps</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <BookOpenIcon className='h-5'></BookOpenIcon>
                <a className={theme.textValid} href="http://www.farevanaa.pf/" target="_blank">L'académie Tahitienne (Fare Vanaa)</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <PencilSquareIcon className='h-5'></PencilSquareIcon>
                <a className={theme.textValid} href="https://huangmanutea.github.io/blog.dev/" target="_blank">Mon blog</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-white"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path></svg>
                <a className={theme.textValid} href="https://github.com/HUANGManutea" target="_blank">Mon GitHub</a>
              </div>
              <div className='flex flex-row gap-1 items-center'>
                <CodeBracketIcon className='h-5'></CodeBracketIcon>
                <a className={theme.textValid} href="https://github.com/HUANGManutea/wordle-tahiti" target="_blank">Le code source de Wordle Tahiti</a>
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
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Mode Daltonisme</span>
              </label>
          </div>
        </div>
      </Modal>
      <Modal isHidden={isModalHowToHidden} setIsHidden={setIsModalHowToHidden} theme={theme}>
        <div>
            <h2>Règles</h2>
            <p>Vous devez deviner le mot du jour en 5 essais.</p>
            <p>Le mot du jour est un mot tahitien de 5 lettres.</p>
            <p>Le 'eta est une lettre.</p>
            <br/>
        </div>
        <div>
            <h2>Saisie</h2>
            <p>Vous pouvez écrire les lettres avec votre clavier si vous êtes sur un ordinateur. Vous pouvez aussi cliquer/appuyer sur le clavier virtuel tahitien en bas de page.</p>
            <br/>
        </div>
        <div>
            <h2>Déroulement du jeu</h2>
            <p>Une fois que vous avez renseigné les 5 lettres, appuyez sur la touche "Entrée" de votre clavier ou du clavier virtuel.</p>
            <p>Le mot descendra dans la grille des essais, chaque lettre sera colorée selon les règles suivantes:</p>
            <br/>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-5 items-center">
                    <Tile theme={theme} character={"A"} valid={1}></Tile>
                    <p>La lettre n'existe pas dans le mot du jour</p>
                </div>
                <div className="flex flex-row gap-5 items-center">
                    <Tile theme={theme} character={"A"} valid={2}></Tile>
                    <p>La lettre existe dans le mot du jour, mais elle n'est pas au bon endroit</p>
                </div>
                <div className="flex flex-row gap-5 items-center">
                    <Tile theme={theme} character={"A"} valid={3}></Tile>
                    <p>La lettre est bien placée</p>
                </div>
            </div>
        </div>
      </Modal>
    </>
  )
}
