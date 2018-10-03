import * as React from 'react';

import { CenterContent } from '../styled/CenterContent';
import { SsdMobilenetv1DetectionParams } from '../types';
import { AdjustableInput } from './AdjustableInput';

export interface SsdMobilenetv1ParamControlsProps {
  detectionParams: SsdMobilenetv1DetectionParams
  onChange: (detectionParams: SsdMobilenetv1DetectionParams) => any
}

export const SsdMobilenetv1ParamControls = (props: SsdMobilenetv1ParamControlsProps) =>
  <CenterContent flexDirection="column">
    <AdjustableInput
      inputId="minConfidence"
      label="minConfidence:"
      value={props.detectionParams.minConfidence}
      minValue={0.1}
      maxValue={0.9}
      step={0.1}
      onChange={(minConfidence: number) => props.onChange({ ...props.detectionParams, minConfidence })}
    />
  </CenterContent>