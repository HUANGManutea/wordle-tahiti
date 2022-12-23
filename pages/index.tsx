import Head from 'next/head'
import Board from '../components/board'
import Keyboard from '../components/keyboard'
import React, { useState, useEffect } from "react";

export default function Home() {
  const word = "TAOTE";
  const wordLength = 5;
  const tries = 5;
  const [chars, setChars] = useState<Array<Array<string>>>(Array(tries).fill(Array(wordLength).fill("")));
  const [charIndex, setCharIndex] = useState(0);
  const [completedRows, setCompletedRows] = useState<Array<number>>([]);
  const [won, setWon] = useState(false);

  const setCharAtCharIndex = (char: string) => {
    const copyChars = JSON.parse(JSON.stringify(chars));
    const row = Math.floor(charIndex/wordLength);
    const col = charIndex%wordLength;
    copyChars[row][col] = char;
    setChars(copyChars);
    const newCharIndex = charIndex + 1;
    setCharIndex(newCharIndex);
    if (newCharIndex%wordLength === 0) {
      setCompletedRows([...completedRows, row]);
      if (copyChars[row].join('') === word) {
        setWon(true);
      }
    }
  };

  useEffect(() => {
    if (won) {
      setTimeout(() => {
        alert("gagné!");
      }, 100)
      
    }
  })

  return (
    <>
      <Head>
        <title>Wordle Tahiti</title>
        <meta name="description" content="Wordle Tahiti" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='flex flex-col justify-between min-h-screen w-1/3 m-auto p-20'>
          <Board word={word} tries={tries} wordLength={wordLength} chars={chars} completedRows={completedRows}></Board>
          <Keyboard won={won} onKeyChosen={(char: string) => setCharAtCharIndex(char)}></Keyboard>
        </div>
      {/* <main className={styles.main}>
        
      </main> */}
    </>
  )
}
