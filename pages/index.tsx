import Head from 'next/head'
import Board from '../components/board'
import Keyboard from '../components/keyboard'
import React, { useState, useEffect } from "react";
import Modal from '../components/modal';
import { Data } from './api/word';

type HomeProps = {
  word: string
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/word");
  const data: Data = await res.json();
  return {props: {word: data.word}};
}

export default function Home(props: HomeProps) {
  const wordLength = 5;
  const tries = 5;
  const [tentatives, setTentatives] = useState<Array<string>>(Array(tries).fill("     "));
  const [currentTentative, setCurrentTentative] = useState("");
  const [tentativeIndex, setTentativeIndex] = useState(0);
  const [won, setWon] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [isModalHidden, setIsModalHidden] = useState(true);

  const onKeyChosen = (char: string) => {
    setSelectedKey(char);
  }

  useEffect(() => {
    if (won) {
      setTimeout(() => {
        setIsModalHidden(false);
        console.log(isModalHidden);
      }, 100)
    }
  }, [won]);

  useEffect(() => {
    if (selectedKey != "") {
      if (selectedKey === '↵') {
        if (currentTentative.length === wordLength) {
          const copyCurrentTentative = `${currentTentative}`; 
          const copyTentatives = JSON.parse(JSON.stringify(tentatives));
          copyTentatives[tentativeIndex] = copyCurrentTentative;
          setTentatives(copyTentatives);
          setCurrentTentative("");
          setTentativeIndex(tentativeIndex + 1);
          if (copyCurrentTentative === props.word) {
            setWon(true);
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
  });

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
          <Board word={props.word} tries={tries} wordLength={wordLength} tentatives={tentatives} currentTentative={currentTentative}></Board>
          <Keyboard won={won} onKeyChosen={(char: string) => onKeyChosen(char)}></Keyboard>
      </div>
      <Modal text='Bravo !' isHidden={isModalHidden} onSuccessClick={() => setIsModalHidden(!isModalHidden)}></Modal>
    </>
  )
}
