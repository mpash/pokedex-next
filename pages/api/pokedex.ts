import { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const file = path.join(process.cwd(), "public/data", "pokedex.json")
  const data = await fs.readFileSync(file, "utf-8")
  return res.status(200).json(JSON.parse(data))
}
