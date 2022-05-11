/**
 * Elements in components-common are meant to be agnostic to the UI framework.
 * Instead of importing the component directly from the package in other files, we will add
 * a wrapper so it can be changed out if need be with this file being the source of truth.
 */

import type {TextProps} from '@chakra-ui/react'
import {Text} from '@chakra-ui/react'
import * as React from 'react'

interface TextPropsType extends TextProps {}

const BaseText = ({...rest}: TextPropsType) => {
  return <Text color={rest.color ?? 'gray.700'} {...rest} />
}

export const H1 = (props: TextPropsType) => (
  <BaseText
    as={'h1'}
    fontSize={props.fontSize ?? '4xl'}
    fontWeight={props.fontWeight ?? 'bold'}
    letterSpacing={props.letterSpacing ?? 'wider'}
    {...props}
  />
)
export const H2 = (props: TextPropsType) => (
  <BaseText
    as={'h2'}
    fontSize={props.fontSize ?? '3xl'}
    fontWeight={props.fontWeight ?? 'semibold'}
    letterSpacing={props.letterSpacing ?? 'wide'}
    {...props}
  />
)
export const H3 = (props: TextPropsType) => (
  <BaseText fontSize={'2xl'} as={'h3'} {...props} />
)
export const H4 = (props: TextPropsType) => (
  <BaseText fontSize={'xl'} as={'h4'} {...props} />
)
export const H5 = (props: TextPropsType) => (
  <BaseText fontSize={'lg'} as={'h5'} {...props} />
)
export const Paragraph = (props: TextPropsType) => (
  <BaseText fontSize={'md'} as="p" {...props} />
)
export const SmallText = (props: TextPropsType) => (
  <BaseText fontSize={'xs'} as="p" {...props} />
)
