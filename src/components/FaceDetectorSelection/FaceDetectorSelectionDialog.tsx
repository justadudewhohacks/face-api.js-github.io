import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { createDefaultFaceDetectorOptionsFromName, FACE_DETECTORS, getFaceDetectorNameFromOptions } from './const';
import { MtcnnControls } from './MtcnnControls';
import { SsdMobilenetv1Controls } from './SsdMobilenetv1Controls';
import { TinyFaceDetectorControls } from './TinyFaceDetectorControls';

export interface FaceDetectorSelectionDialogProps {
  initialFaceDetectionOptions: faceapi.FaceDetectionOptions
  onClose: (faceDetectionOptions: faceapi.FaceDetectionOptions) => any
}

export interface FaceDetectorSelectionState {
  faceDetectionOptions: faceapi.FaceDetectionOptions
}

export class FaceDetectorSelectionDialog extends React.Component<FaceDetectorSelectionDialogProps, FaceDetectorSelectionState> {
  constructor(props: FaceDetectorSelectionDialogProps) {
    super(props)
    this.state = {
      faceDetectionOptions: props.initialFaceDetectionOptions
    }
  }

  onFaceDetectionOptionsChanged = (faceDetectionOptions: faceapi.FaceDetectionOptions) => {
    this.setState({ faceDetectionOptions })
  }

  renderSelection = () =>
    <div>
      <Mui.InputLabel htmlFor="Dialog">
        Choose face detector:
      </Mui.InputLabel>
      <Mui.Select
        value={getFaceDetectorNameFromOptions(this.state.faceDetectionOptions)}
        onChange={e => this.setState({ faceDetectionOptions: createDefaultFaceDetectorOptionsFromName(e.target.value) })}
        input={<Mui.Input />}
        id="Dialog"
      >
      {
        FACE_DETECTORS.map(item =>
          <Mui.MenuItem
            key={item}
            value={item}
          >
            { item }
          </Mui.MenuItem>
        )
      }
      </Mui.Select>
    </div>

  renderControls = () => {
    if (this.state.faceDetectionOptions instanceof faceapi.SsdMobilenetv1Options) {
      return (
        <SsdMobilenetv1Controls
          detectionParams={this.state.faceDetectionOptions}
          onParamsChanged={this.onFaceDetectionOptionsChanged}
        />
      )
    } else if (this.state.faceDetectionOptions instanceof faceapi.TinyFaceDetectorOptions) {
      return (
        <TinyFaceDetectorControls
          inputSizes={[128, 160, 224, 320, 416, 512, 608]}
          detectionParams={this.state.faceDetectionOptions}
          onParamsChanged={this.onFaceDetectionOptionsChanged}
        />
      )
    } else if (this.state.faceDetectionOptions instanceof faceapi.MtcnnOptions) {
      return (
        <MtcnnControls
          detectionParams={this.state.faceDetectionOptions}
          onParamsChanged={this.onFaceDetectionOptionsChanged}
        />
      )
    }
  }

  render() {
    return (
      <Mui.Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={true}
      >
        <Mui.DialogTitle>
          { 'Face Detector Options' }
        </Mui.DialogTitle>
        <Mui.DialogContent>
          {
            <Mui.FormControl>
              { this.renderSelection() }
              { this.renderControls() }
              <Mui.Button variant='outlined' onClick={() => this.props.onClose(this.state.faceDetectionOptions)}>
                { 'Save' }
              </Mui.Button>
            </Mui.FormControl>
          }
        </Mui.DialogContent>
      </Mui.Dialog>
    )
  }
}
