import { Button, FormControl, Input, InputLabel } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { SideBySide } from '../styled/SideBySide';

export const StyledFormControl = styled(FormControl)`
  margin: 10px !important;
`

export const StyledButton = styled(Button)`
  width: 40px;
  height: 40px;
`

export type AdjustableInputProps = {
  inputId: string
  label: string
  value: number
  minValue: number
  maxValue: number
  step: number
  onChange: (newValue: number) => any
}

export const AdjustableInput = (props: AdjustableInputProps) =>
  <StyledFormControl>
    <SideBySide>
      <InputLabel htmlFor={props.inputId}>
        { props.label }
      </InputLabel>
      <Input
        id={props.inputId}
        value={props.value}
      />
      <StyledButton
        variant="outlined"
        onClick={
          () => props.onChange(Math.max(props.value - props.step, props.minValue))
        }
      >
        -
      </StyledButton>
      <StyledButton
        variant="outlined"
        onClick={
          () => props.onChange(Math.min(props.value + props.step, props.maxValue))
        }
      >
        +
      </StyledButton>
    </SideBySide>
  </StyledFormControl>