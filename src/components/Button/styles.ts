import styled from "styled-components";
import { ButtonVariants } from "./types";

interface ButtonContainerProps {
  variant: ButtonVariants;
}

const buttonVariants = {
  primary: 'blue',
  secondary: 'black',
  danger: 'red',
  success: 'green',
  warning: 'yellow'
}

export const ButtonContainer = styled.button<ButtonContainerProps>`
  width: 100px;
  height: 50px;

 /*  background-color: ${props => buttonVariants[props.variant]} */

 background-color: ${props => props.theme.primary};
`