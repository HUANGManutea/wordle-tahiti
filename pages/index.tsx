import Head from 'next/head'
import Board from '../components/board'
import Keyboard from '../components/keyboard'
import React, { useState, useEffect } from "react";
import Modal from '../components/modal';
import { Data } from './api/word';
import Header from '../components/header';
import { Theme } from '../lib/theme';

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
  const [isModalHidden, setIsModalHidden] = useState(true);
  const [modalText, setModalText] = useState("");
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

  useEffect(() => {
    if (gameState === 'WIN') {
      setTimeout(() => {
        setModalText("Bravo !");
        setIsModalHidden(false);
      }, 100)
    } else if (gameState === 'LOSE') {
      setTimeout(() => {
        setModalText(`La bonne réponse était: ${props.word}`);
        setIsModalHidden(false);
      }, 100)
    }
  }, [gameState, tentativeIndex, tentatives]);

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
      <div className='flex flex-col justify-between min-h-screen m-auto p-5 sm:p-20'>
          <Header onCheckedColorblind={onCheckedColorblind}></Header>
          <Board theme={theme} word={props.word} tries={tries} wordLength={wordLength} tentatives={tentatives} currentTentative={currentTentative}></Board>
          <Keyboard gameState={gameState} onKeyChosen={(char: string) => onKeyChosen(char)}></Keyboard>
      </div>
      <Modal theme={theme} text={modalText} isHidden={isModalHidden} onSuccessClick={() => setIsModalHidden(!isModalHidden)}></Modal>
    </>
  )
}
