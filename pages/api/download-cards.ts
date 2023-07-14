import { NextApiRequest, NextApiResponse } from 'next'

const fetchCardPage = async (page: number) => {
  const url = `https://api.pokemontcg.io/v2/cards?page=${page}`
  const res = await fetch(url)
  const cardJson = await res.json()

  return cardJson.data
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  // Pages - 23, 34, 45, 56
  const pages = Array.from({ length: 66 }, (_, i) => i)
  const fetchPromises = pages.map(fetchCardPage)

  const cardsArrays = await Promise.all(fetchPromises)

  const cards = [].concat(...cardsArrays)

  res.status(200).json({ data: cards })
}
