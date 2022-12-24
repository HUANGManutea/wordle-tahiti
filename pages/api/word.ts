// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { differenceInDays } from 'date-fns/fp';
import type { NextApiRequest, NextApiResponse } from 'next'

export type Data = {
  word: string
}
const dateDebut = process.env.DATE_DEBUT;

const wordList = ["TAOTE", "RA'AU"];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (dateDebut) {
    console.log("dateDebut");
    const diffDays = differenceInDays(new Date(), Date.parse(dateDebut));
    res.status(200).json({ word: wordList[diffDays%wordList.length] })
  } else {
    res.status(500).json({word: ""});
  }
}
