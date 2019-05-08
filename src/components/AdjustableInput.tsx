import * as Mui from '@material-ui/core';
import * as React from 'react';

import { SideBySide } from './styled/SideBySide';

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
  <Mui.FormControl>
    <SideBySide>
      <Mui.InputLabel htmlFor={props.inputId}>
        { props.label }
      </Mui.InputLabel>
      <Mui.Input
        id={props.inputId}
        value={props.value}
      />
      <Mui.Button
        variant="outlined"
        onClick={
          () => props.onChange(Math.max(props.value - props.step, props.minValue))
        }
      >
        -
      </Mui.Button>
      <Mui.Button
        variant="outlined"
        onClick={
          () => props.onChange(Math.min(props.value + props.step, props.maxValue))
        }
      >
        +
      </Mui.Button>
    </SideBySide>
  </Mui.FormControl>