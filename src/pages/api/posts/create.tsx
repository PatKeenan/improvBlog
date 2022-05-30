import { validateRoute } from '@lib/validateRoute'

export default validateRoute((req, res, user) => {
  try {
    res.json(user)
  } catch (error) {}
})
