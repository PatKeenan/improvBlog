import { Button as ChakraButton } from '@chakra-ui/react'
import type { ButtonProps } from '@chakra-ui/react'
interface ButtonInterface extends ButtonProps {}

const ButtonBase = (props: ButtonProps) => <ChakraButton {...props} />

const PrimaryButton = () => <ButtonBase bg={'blue.400'} color={'white'} />
