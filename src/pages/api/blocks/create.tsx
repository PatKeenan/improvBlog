import { validateRoute } from '@lib/validateRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default validateRoute((req: NextApiRequest, res: NextApiResponse) => {
  res.json({ message: 'hello from blocks' })
})
