import { IMtcnnOptions, MtcnnOptions } from 'face-api.js';
import * as React from 'react';

import { ReactElement } from '../../face-api.js-react';
import { AdjustableInput } from '../components/AdjustableInput';
import { CenterContent } from '../styled/CenterContent';

export interface MtcnnParamControlsProps {
  detectionParams: MtcnnOptions
  onChange: (detectionParams: MtcnnOptions) => any
}

export const MtcnnParamControls = (props: MtcnnParamControlsProps) => {

  const assignOptions = (partial: Partial<IMtcnnOptions>): MtcnnOptions => {
    const { scaleFactor, minFaceSize } = props.detectionParams
    return new MtcnnOptions({ scaleFactor, minFaceSize, ...partial })
  }

  return (
    <CenterContent>
      <AdjustableInput
        inputId="scaleFactor"
        label="scaleFactor:"
        value={props.detectionParams.scaleFactor}
        minValue={0.1}
        maxValue={0.9}
        step={0.05}
        onChange={
          (scaleFactor: number) => props.onChange(
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
          (minFaceSize: number) => props.onChange(
            assignOptions({ minFaceSize })
          )
        }
      />
    </CenterContent>
  )
}

export type MtcnnControlsProps = {
  children: (detectionParams: MtcnnOptions, renderControls: () => ReactElement) => ReactElement
}

export type MtcnnControlsState = {
  detectionParams: MtcnnOptions
}

export class MtcnnControls extends React.Component<MtcnnControlsProps, MtcnnControlsState> {

  state: MtcnnControlsState = {
    detectionParams: new MtcnnOptions()
  }

  renderControls = () =>
    <MtcnnParamControls
      detectionParams={this.state.detectionParams}
      onChange={detectionParams => this.setState({ detectionParams })}
    />

  public render() {
    return this.props.children(this.state.detectionParams, this.renderControls)
  }
}