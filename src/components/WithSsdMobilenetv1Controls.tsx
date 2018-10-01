import * as React from 'react';

import { SsdMobilenetv1DetectionParams } from '../types';
import { SsdMobilenetv1ParamControls } from './SsdMobilenetv1ParamControls';

type WithSsdMobilenetv1ControlsProps = {
  children: (props: WithSsdMobilenetv1ControlsState) => React.Component | JSX.Element | React.Component[] | JSX.Element[]
}

type WithSsdMobilenetv1ControlsState = {
  detectionParams: SsdMobilenetv1DetectionParams
}

export class WithSsdMobilenetv1Controls extends React.Component<WithSsdMobilenetv1ControlsProps, WithSsdMobilenetv1ControlsState> {

  state: WithSsdMobilenetv1ControlsState = {
    detectionParams: {
      minConfidence: 0.5
    }
  }

  public render() {
    const { detectionParams } = this.state

    return(
      <span>
        <SsdMobilenetv1ParamControls
          detectionParams={detectionParams}
          onChange={detectionParams => this.setState({ detectionParams })}
        />
        {
          this.props.children({ detectionParams })
        }
      </span>
    )
  }
}