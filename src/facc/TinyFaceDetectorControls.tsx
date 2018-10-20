import { Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import { ITinyFaceDetectorOptions, TinyFaceDetectorOptions } from 'face-api.js';
import * as React from 'react';

import { ReactElement } from '../../face-api.js-react';
import { AdjustableInput } from '../components/AdjustableInput';
import { CenterContent } from '../styled/CenterContent';

export interface TinyFaceDetectorParamControlsProps {
  inputSizes: number[]
  detectionParams: TinyFaceDetectorOptions
  onChange: (detectionParams: TinyFaceDetectorOptions) => any
}

export const TinyFaceDetectorParamControls = (props: TinyFaceDetectorParamControlsProps) => {

  const assignOptions = (partial: Partial<ITinyFaceDetectorOptions>): TinyFaceDetectorOptions => {
    const { inputSize, scoreThreshold } = props.detectionParams
    return new TinyFaceDetectorOptions({ inputSize, scoreThreshold, ...partial })
  }

  return (
    <CenterContent>
      <InputLabel htmlFor="selectInputSize">
        Input Size
      </InputLabel>
      <Select
        value={props.detectionParams.inputSize}
        onChange={
          (e: any) => props.onChange(
            assignOptions({ inputSize: e.target.value })
          )
        }
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
        minValue={0.1}
        maxValue={0.9}
        step={0.1}
        onChange={
          (scoreThreshold: number) => props.onChange(
            assignOptions({ scoreThreshold })
          )
        }
      />
    </CenterContent>
  )
}

export type TinyFaceDetectorControlsProps = {
  inputSizes: number[]
  children: (props: TinyFaceDetectorOptions, renderControls: () => ReactElement) => ReactElement
  initialDetectionParams?: TinyFaceDetectorOptions
}

export type TinyFaceDetectorControlsState = {
  detectionParams: TinyFaceDetectorOptions
}

export class TinyFaceDetectorControls extends React.Component<TinyFaceDetectorControlsProps, TinyFaceDetectorControlsState> {

  static defaultProps: Partial<TinyFaceDetectorControlsProps> = {
    initialDetectionParams: new TinyFaceDetectorOptions()
  }

  constructor(props: TinyFaceDetectorControlsProps) {
    super(props)
    this.state = {
      detectionParams: this.props.initialDetectionParams
    }
  }

  renderControls = () =>
    <TinyFaceDetectorParamControls
      inputSizes={this.props.inputSizes}
      detectionParams={this.state.detectionParams}
      onChange={detectionParams => this.setState({ detectionParams })}
    />

  public render() {
    return this.props.children(this.state.detectionParams, this.renderControls)
  }
}