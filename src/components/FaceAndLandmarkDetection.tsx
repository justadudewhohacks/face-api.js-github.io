import * as Mui from '@material-ui/core';
import { FaceDetectionOptions, TinyFaceDetectorOptions } from 'face-api.js';
import { MediaElement } from 'face-api.js-react';
import * as React from 'react';

import { ReactElement } from '../../face-api.js-react';
import { FaceDetection } from './FaceDetection';

export type FaceAndLandmarkDetectionProps = {
  input?: MediaElement
  overlay?: HTMLCanvasElement
}

type Props = FaceAndLandmarkDetectionProps & {
  initialFaceDetector: string
  initialTinyFaceDetectorOptions?: TinyFaceDetectorOptions
  children?: (detectionOptions: FaceDetectionOptions, withBoxes: boolean, withLandmarks: boolean) => ReactElement
}

type FaceAndLandmarkDetectionState = {
  withLandmarks: boolean
}

export class FaceAndLandmarkDetection extends React.Component<Props, FaceAndLandmarkDetectionState> {

  state: FaceAndLandmarkDetectionState = {
    withLandmarks: false
  }

  public render() {
    return (
      <FaceDetection
        {...this.props}
        renderCheckboxes={
          () =>
            <Mui.FormControlLabel
              control={
                <Mui.Checkbox
                  checked={this.state.withLandmarks}
                  onChange={() => this.setState({ withLandmarks: !this.state.withLandmarks })}
                  color="primary"
                />
              }
              label="Detect Face Landmarks"
            />
        }
      >
        {
          (detectionOptions, withBoxes) =>
            this.props.children(detectionOptions, withBoxes, this.state.withLandmarks)
        }
      </FaceDetection>
    )
  }
}
