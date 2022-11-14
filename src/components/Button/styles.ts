import styled from 'styled-components'
import { ButtonVariants } from './types'

interface ButtonContainerProps {
  variant: ButtonVariants
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 50px;

  background-color: ${(props) => props.theme['green-500']};
`
