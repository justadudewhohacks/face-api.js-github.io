import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { getFaceDetectorNameFromOptions } from './const';
import { FaceDetectorSelectionDialog } from './FaceDetectorSelectionDialog';

export interface FaceDetectorSelectionProps {
  initialFaceDetectionOptions?: faceapi.FaceDetectionOptions
}

export interface FaceDetectorSelectionState {
  faceDetectionOptions: faceapi.FaceDetectionOptions
  isDialogOpen: boolean
}

export class FaceDetectorSelection extends React.Component<FaceDetectorSelectionProps, FaceDetectorSelectionState> {
  constructor(props: FaceDetectorSelectionProps) {
    super(props)
    this.state = {
      faceDetectionOptions: props.initialFaceDetectionOptions || new faceapi.TinyFaceDetectorOptions(),
      isDialogOpen: false
    }
  }

  onCloseDialog = (faceDetectionOptions: faceapi.FaceDetectionOptions) => {
    this.setState({ faceDetectionOptions, isDialogOpen: false })
  }

  onOpenDialog = () => {
    this.setState({ isDialogOpen: true })
  }

  renderDialog = () => {
  }

  render() {
    const dialog = this.state.isDialogOpen
      ?
        <FaceDetectorSelectionDialog
          initialFaceDetectionOptions={this.state.faceDetectionOptions}
          onClose={this.onCloseDialog}
        />
      : null

    return (
      <div>
        { dialog }
        <Mui.Button variant='outlined' onClick={this.onOpenDialog}>
          { getFaceDetectorNameFromOptions(this.state.faceDetectionOptions) }
        </Mui.Button>
      </div>
    )
  }
}
