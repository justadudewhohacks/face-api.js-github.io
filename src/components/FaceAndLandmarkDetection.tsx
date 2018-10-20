import * as Mui from '@material-ui/core';
import { FaceDetectionOptions, TinyFaceDetectorOptions } from 'face-api.js';
import { LoadModels, MediaElement } from 'face-api.js-react';
import * as React from 'react';

import { ReactElement } from '../../face-api.js-react';
import { ModalLoader } from '../components/ModalLoader';
import { getFaceDetectionModelUri, MODELS_URI } from '../const';
import { SelectFaceDetector } from '../facc/SelectFaceDetector';
import { CenterContent } from '../styled/CenterContent';

export type FaceAndLandmarkDetectionOptions = {
  withLandmarks: boolean
  withBoxes: boolean
}

export type FaceAndLandmarkDetectionProps = {
  input?: MediaElement
  overlay?: HTMLCanvasElement
}

type Props = FaceAndLandmarkDetectionProps & {
  initialFaceDetector: string
  initialTinyFaceDetectorOptions?: TinyFaceDetectorOptions
  children?: (detectionOptions: FaceDetectionOptions, options: FaceAndLandmarkDetectionOptions) => ReactElement
}

type FaceAndLandmarkDetectionState = FaceAndLandmarkDetectionOptions

export class FaceAndLandmarkDetection extends React.Component<Props, FaceAndLandmarkDetectionState> {

  state: FaceAndLandmarkDetectionState = {
    withLandmarks: false,
    withBoxes: true
  }

  public render() {
    return (
      <SelectFaceDetector
        initialFaceDetector={this.props.initialFaceDetector}
        initialTinyFaceDetectorOptions={this.props.initialTinyFaceDetectorOptions}
      >
      {(detectorName, detectionOptions, renderFaceDetectorSelection, renderFaceDetectorControls) =>
        <LoadModels
          {...getFaceDetectionModelUri(detectorName, MODELS_URI)}
          faceLandmarkModelUrl={MODELS_URI}
          renderBusyComponent={() => <ModalLoader title={`Loading ${detectorName} Model`} />}
        >
        {() =>
          <div>
            <CenterContent>
              { renderFaceDetectorSelection() }
              <CenterContent flexDirection="column" alignItems="baseline">
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
                <Mui.FormControlLabel
                  control={
                    <Mui.Checkbox
                      checked={!this.state.withBoxes}
                      onChange={() => this.setState({ withBoxes: !this.state.withBoxes })}
                      color="primary"
                    />
                  }
                  label="Hide Bounding Boxes"
                />
                </CenterContent>
            </CenterContent>
            { renderFaceDetectorControls() }
            { this.props.children ? this.props.children(detectionOptions, this.state) : null }
          </div>
        }
        </LoadModels>
      }
      </SelectFaceDetector>
    )
  }
}
