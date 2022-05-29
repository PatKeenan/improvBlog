import { validateRoute } from "@lib/validateRoute";

export default validateRoute((req, res, user) => {
    return res.json(user)
})