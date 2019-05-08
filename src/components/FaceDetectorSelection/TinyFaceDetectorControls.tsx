import * as Mui from '@material-ui/core';
import { ITinyFaceDetectorOptions, TinyFaceDetectorOptions } from 'face-api.js';
import * as React from 'react';

import { AdjustableInput } from '../AdjustableInput';

export interface TinyFaceDetectorControlsProps {
  inputSizes: number[]
  detectionParams: TinyFaceDetectorOptions
  onParamsChanged: (detectionParams: TinyFaceDetectorOptions) => any
}

export const TinyFaceDetectorControls = (props: TinyFaceDetectorControlsProps) => {

  const assignOptions = (partial: Partial<ITinyFaceDetectorOptions>): TinyFaceDetectorOptions => {
    const { inputSize, scoreThreshold } = props.detectionParams
    return new TinyFaceDetectorOptions({ inputSize, scoreThreshold, ...partial })
  }

  return (
    <Mui.FormControl>
      <Mui.FormControl>
        <Mui.InputLabel htmlFor="selectInputSize">
          Input Size
        </Mui.InputLabel>
        <Mui.Select
          value={props.detectionParams.inputSize}
          onChange={
            (e: any) => props.onParamsChanged(
              assignOptions({ inputSize: e.target.value })
            )
          }
          input={<Mui.Input />}
          id="selectInputSize"
        >
          {
            props.inputSizes.map((size: number) =>
              <Mui.MenuItem
                key={size}
                value={size}
              >
                { size }
              </Mui.MenuItem>
            )
          }
        </Mui.Select>
      </Mui.FormControl>
      <AdjustableInput
        inputId="scoreThreshold"
        label="scoreThreshold:"
        value={props.detectionParams.scoreThreshold}
        minValue={0.1}
        maxValue={0.9}
        step={0.1}
        onChange={
          (scoreThreshold: number) => props.onParamsChanged(
            assignOptions({ scoreThreshold })
          )
        }
      />
    </Mui.FormControl>
  )
}