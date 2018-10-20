import { ISsdMobilenetv1Options, SsdMobilenetv1Options } from 'face-api.js';
import * as React from 'react';

import { ReactElement } from '../../face-api.js-react';
import { AdjustableInput } from '../components/AdjustableInput';
import { CenterContent } from '../styled/CenterContent';

export interface SsdMobilenetv1ParamControlsProps {
  detectionParams: SsdMobilenetv1Options
  onChange: (detectionParams: SsdMobilenetv1Options) => any
}

export const SsdMobilenetv1ParamControls = (props: SsdMobilenetv1ParamControlsProps) => {

  const assignOptions = (partial: Partial<ISsdMobilenetv1Options>): SsdMobilenetv1Options => {
    const { minConfidence } = props.detectionParams
    return new SsdMobilenetv1Options({ minConfidence, ...partial })
  }

  return (
    <CenterContent>
      <AdjustableInput
        inputId="minConfidence"
        label="minConfidence:"
        value={props.detectionParams.minConfidence}
        minValue={0.1}
        maxValue={0.9}
        step={0.1}
        onChange={
          (minConfidence: number) => props.onChange(
            assignOptions({ minConfidence })
          )
        }
      />
    </CenterContent>
  )
}

export type SsdMobilenetv1ControlsProps = {
  children: (detectionParams: SsdMobilenetv1Options, renderControls: () => ReactElement) => ReactElement
}

export type SsdMobilenetv1ControlsState = {
  detectionParams: SsdMobilenetv1Options
}

export class SsdMobilenetv1Controls extends React.Component<SsdMobilenetv1ControlsProps, SsdMobilenetv1ControlsState> {

  state: SsdMobilenetv1ControlsState = {
    detectionParams: new SsdMobilenetv1Options()
  }

  renderControls = () =>
    <SsdMobilenetv1ParamControls
      detectionParams={this.state.detectionParams}
      onChange={detectionParams => this.setState({ detectionParams })}
    />

  public render() {
    return this.props.children(this.state.detectionParams, this.renderControls)
  }
}