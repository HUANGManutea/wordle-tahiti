// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { differenceInDays } from 'date-fns/fp';
import type { NextApiRequest, NextApiResponse } from 'next'
import { zonedTimeToUtc } from 'date-fns-tz'


export type Data = {
  word: Array<string>
}
const dateDebut = process.env.DATE_DEBUT;

const wordList = ["TAOTE", "'ĪFENA"];

const splitWord = (word: string) => {
  let result: string[] = [];
  for (let i = 0; i < word.length; i++) {
      let tempChar = "";
      if (word.charAt(i) === "'") {
          tempChar = word.charAt(i);
          i++;
      }
      tempChar += word.charAt(i);
      result = [...result, tempChar];
  }
  return result;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (dateDebut) {
    const dateDebutUTC = zonedTimeToUtc(dateDebut, 'Pacific/Tahiti');
    const currentDateUTC = new Date();
    const diffDays = differenceInDays(dateDebutUTC, currentDateUTC);
    res.status(200).json({ word: splitWord(wordList[diffDays%wordList.length]) })
  } else {
    res.status(500).json({word: []});
  }
}
