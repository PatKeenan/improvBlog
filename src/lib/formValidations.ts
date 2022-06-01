import * as Yup from 'yup'


  export const baseAuthSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Must be a valid email')
      .trim(),
    password: Yup.string()
      .required('Password is mandatory')
      .min(6, 'Password must be at 3 char long')
      .trim()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      )
      })

  export const signInSchema = baseAuthSchema.shape({})

  export const signUpSchema = signInSchema.shape({
    username: Yup.string()
    .required('Username is required')
    .min(4, 'Username must be at least 4 characters long.')
    .trim(),
     confirmPassword: Yup.string()
       .required('Password is mandatory')
       .min(6)
       .trim()
       .oneOf([Yup.ref('password')], 'Passwords does not match'),
   })

  

   export const PostPlotTitleSchema = Yup.object().shape({
    title: Yup.string().required().min(4).max(255),
    plot: Yup.string().required('Plot is required').min(6).max(500),
  })