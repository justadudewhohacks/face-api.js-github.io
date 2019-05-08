import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { AdjustableInput } from '../AdjustableInput';

export interface SsdMobilenetv1ControlsProps {
  detectionParams: faceapi.SsdMobilenetv1Options
  onParamsChanged: (detectionParams: faceapi.SsdMobilenetv1Options) => any
}

export const SsdMobilenetv1Controls = (props: SsdMobilenetv1ControlsProps) => {

  const assignOptions = (partial: Partial<faceapi.ISsdMobilenetv1Options>): faceapi.SsdMobilenetv1Options => {
    const { minConfidence } = props.detectionParams
    return new faceapi.SsdMobilenetv1Options({ minConfidence, ...partial })
  }

  return (
    <Mui.FormControl>
      <AdjustableInput
        inputId="minConfidence"
        label="minConfidence:"
        value={props.detectionParams.minConfidence}
        minValue={0.1}
        maxValue={0.9}
        step={0.1}
        onChange={
          (minConfidence: number) => props.onParamsChanged(
            assignOptions({ minConfidence })
          )
        }
      />
    </Mui.FormControl>
  )
}