import * as Mui from '@material-ui/core';
import { FaceDetectionOptions, TinyFaceDetectorOptions } from 'face-api.js';
import { LoadModels } from 'face-api.js-react';
import * as React from 'react';

import { ReactElement } from '../../face-api.js-react';
import { ModalLoader } from '../components/ModalLoader';
import { getFaceDetectionModelUri, MODELS_URI } from '../const';
import { SelectFaceDetector } from '../facc/SelectFaceDetector';
import { CenterContent } from '../styled/CenterContent';


type Props = {
  initialFaceDetector: string
  initialTinyFaceDetectorOptions?: TinyFaceDetectorOptions
  children?: (detectionOptions: FaceDetectionOptions, withBoxes: boolean) => ReactElement
  renderCheckboxes?: () => ReactElement
}

type FaceDetectionState = {
  withBoxes: boolean
}

export class FaceDetection extends React.Component<Props, FaceDetectionState> {

  state: FaceDetectionState = {
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
                {
                  this.props.renderCheckboxes ? this.props.renderCheckboxes() : null
                }
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
            { this.props.children ? this.props.children(detectionOptions, this.state.withBoxes) : null }
          </div>
        }
        </LoadModels>
      }
      </SelectFaceDetector>
    )
  }
}
