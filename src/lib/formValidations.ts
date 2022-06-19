import {z} from 'zod'


export const signInSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6).trim().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
   'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character')
})
export type SignInSchema = z.infer<typeof signInSchema>

export const signUpSchema = signInSchema.extend({
  username: z.string()
  .min(4, 'Username must be at least 4 characters long.')
  .trim(),
  confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
})
export type SignUpSchema = z.infer<typeof signUpSchema>


export const postPlotTitleSchema = z.object({
  title: z.string().min(6, {message: "Title must be at least 6 characters long."}).max(255, {message: "Title must be less than 255 characters."}),
  plot: z.string().min(6, {message: "Plot must be at least 6 characters long."}).max(500, {message: "Plot must be less than 500 characters."}),
})
export type PostPlotTitleSchema = z.infer<typeof postPlotTitleSchema>


export const contributionSchema = z.object({
  content: z.string().min(10).max(500)
})
export type ContributionSchema = z.infer<typeof contributionSchema>