import { Input, MenuItem, Select, InputLabel } from '@material-ui/core';
import * as React from 'react';

import { FACE_DETECTORS } from '../const';

export interface ChooseFaceDetectorProps {
  children: (faceDetector: string) => React.Component | JSX.Element | React.Component[] | JSX.Element[]
}

export interface ChooseFaceDetectorState {
  detector: string | null
}


export class ChooseFaceDetector extends React.Component<ChooseFaceDetectorProps, ChooseFaceDetectorState> {
  state: ChooseFaceDetectorState = {
    detector: ''
  }

  render() {
    return (
      <div>
        <InputLabel htmlFor="selectFaceDetector">
          Choose face detector:
        </InputLabel>
        <Select
          value={this.state.detector}
          onChange={e => this.setState({ detector: e.target.value })}
          input={<Input />}
          id="selectFaceDetector"
        >
          {
            FACE_DETECTORS.map(item =>
              <MenuItem
                key={item}
                value={item}
              >
                { item }
              </MenuItem>
            )
          }
        </Select>
        { this.state.detector ? this.props.children(this.state.detector) : null }
      </div>
    )
  }
}
