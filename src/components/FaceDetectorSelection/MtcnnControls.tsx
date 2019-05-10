import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { AdjustableInput } from '../AdjustableInput';

export interface MtcnnControlsProps {
  detectionParams: faceapi.MtcnnOptions
  onParamsChanged: (detectionParams: faceapi.MtcnnOptions) => any
}

export const MtcnnControls = (props: MtcnnControlsProps) => {

  const assignOptions = (partial: Partial<faceapi.IMtcnnOptions>): faceapi.MtcnnOptions => {
    const { scaleFactor, minFaceSize } = props.detectionParams
    return new faceapi.MtcnnOptions({ scaleFactor, minFaceSize, ...partial })
  }

  return (
    <Mui.FormControl>
      <AdjustableInput
        inputId="scaleFactor"
        label="scaleFactor:"
        value={props.detectionParams.scaleFactor}
        minValue={0.1}
        maxValue={0.9}
        step={0.05}
        onChange={
          (scaleFactor: number) => props.onParamsChanged(
            assignOptions({ scaleFactor })
          )
        }
      />
      <AdjustableInput
        inputId="minFaceSize"
        label="minFaceSize:"
        value={props.detectionParams.minFaceSize}
        minValue={40}
        maxValue={400}
        step={40}
        onChange={
          (minFaceSize: number) => props.onParamsChanged(
            assignOptions({ minFaceSize })
          )
        }
      />
    </Mui.FormControl>
  )
}