import { Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

import { CenterContent } from '../styled/CenterContent';
import { TinyYolov2DetectionParams } from '../types';
import { AdjustableInput } from './AdjustableInput';

export interface TinyYolov2ParamControlsProps {
  inputSizes: number[]
  detectionParams: TinyYolov2DetectionParams
  onChange: (detectionParams: TinyYolov2DetectionParams) => any
}

export const TinyYolov2ParamControls = (props: TinyYolov2ParamControlsProps) =>
  <CenterContent flexDirection="column">
    <InputLabel htmlFor="selectInputSize">
      Input Size
    </InputLabel>
    <Select
      value={props.detectionParams.inputSize}
      onChange={(e: any) => props.onChange({ ...props.detectionParams, inputSize: parseInt(e.target.value) })}
      input={<Input />}
      id="selectInputSize"
    >
      {
        props.inputSizes.map((size: number) =>
          <MenuItem
            key={size}
            value={size}
          >
            { size }
          </MenuItem>
        )
      }
    </Select>
    <AdjustableInput
      inputId="scoreThreshold"
      label="scoreThreshold:"
      value={props.detectionParams.scoreThreshold}
      minValue={0.5}
      maxValue={0.9}
      step={0.1}
      onChange={
        (scoreThreshold: number) => props.onChange({ ...props.detectionParams, scoreThreshold })
      }
    />
  </CenterContent>