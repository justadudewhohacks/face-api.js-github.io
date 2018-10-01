import * as React from 'react';

import { TinyYolov2ParamControls } from './TinyYolov2ParamControls';

type WithTinyYolov2ControlsProps = {
  children: (props: WithTinyYolov2ControlsState) => React.Component | JSX.Element | React.Component[] | JSX.Element[]
}

type WithTinyYolov2ControlsState = {
  detectionParams: { inputSize: number, scoreThreshold: number }
}

export class WithTinyYolov2Controls extends React.Component<WithTinyYolov2ControlsProps, WithTinyYolov2ControlsState> {

  state: WithTinyYolov2ControlsState = {
    detectionParams: {
      scoreThreshold: 0.5,
      inputSize: 416
    }
  }

  public render() {
    const { detectionParams } = this.state

    return(
      <span>
        <TinyYolov2ParamControls
          inputSizes={[224, 320, 416, 618]}
          detectionParams={this.state.detectionParams}
          onChange={detectionParams => this.setState({ detectionParams })}
        />
        {
          this.props.children({ detectionParams })
        }
      </span>
    )
  }
}