import * as React from 'react';

import { MtcnnParamControls } from './MtcnnParamControls';
import { MtcnnDetectionParams } from '../types';

type WithMtcnnControlsProps = {
  children: (props: WithMtcnnControlsState) => React.Component | JSX.Element | React.Component[] | JSX.Element[]
}

type WithMtcnnControlsState = {
  detectionParams: MtcnnDetectionParams
}

export class WithMtcnnControls extends React.Component<WithMtcnnControlsProps, WithMtcnnControlsState> {

  state: WithMtcnnControlsState = {
    detectionParams: {
      minFaceSize: 20,
      scaleFactor: 0.8
    }
  }

  public render() {
    const { detectionParams } = this.state

    return(
      <span>
        <MtcnnParamControls
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