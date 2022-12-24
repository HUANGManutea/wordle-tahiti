// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { differenceInDays } from 'date-fns/fp';
import type { NextApiRequest, NextApiResponse } from 'next'
import { zonedTimeToUtc } from 'date-fns-tz'


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
    const dateDebutUTC = zonedTimeToUtc(dateDebut, 'Pacific/Tahiti');
    const currentDateUTC = new Date();
    const diffDays = differenceInDays(currentDateUTC, dateDebutUTC);
    res.status(200).json({ word: wordList[diffDays%wordList.length] })
  } else {
    res.status(500).json({word: ""});
  }
}
