import * as React from 'react';

import { CenterContent } from '../styled/CenterContent';
import { AdjustableInput } from './AdjustableInput';

export interface MtcnnParamControlsProps {
  detectionParams: { minFaceSize: number, scaleFactor: number }
  onChange: (detectionParams: { minFaceSize: number, scaleFactor: number }) => any
}

export const MtcnnParamControls = (props: MtcnnParamControlsProps) =>
  <CenterContent flexDirection="column">
    <AdjustableInput
      inputId="scaleFactor"
      label="scaleFactor:"
      value={props.detectionParams.scaleFactor}
      minValue={0.1}
      maxValue={0.9}
      step={0.05}
      onChange={
        (scaleFactor: number) => props.onChange({ ...props.detectionParams, scaleFactor })
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
        (minFaceSize: number) => props.onChange({ ...props.detectionParams, minFaceSize })
      }
    />
  </CenterContent>