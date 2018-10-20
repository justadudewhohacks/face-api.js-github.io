import * as faceapi from 'face-api.js';
import * as React from 'react';

import { displayResults } from '../../face-api.js-react';
import { FaceAndLandmarkDetectionOptions, FaceAndLandmarkDetectionProps } from './FaceAndLandmarkDetection';
import { FaceDetectionOptions } from 'face-api.js';

export type TrackFacesProps = FaceAndLandmarkDetectionProps & {
  detectionOptions: FaceDetectionOptions
  options: FaceAndLandmarkDetectionOptions
}

export class TrackFaces extends React.Component<TrackFacesProps> {

  isActive: boolean = false

  run = async () => {
    if (!this.isActive) {
      return
    }

    if (!this.props.input) {
      return setTimeout(this.run, 0)
    }

    const { withLandmarks, withBoxes } = this.props.options
    const detectionTask = faceapi.detectAllFaces(this.props.input.element, this.props.detectionOptions)
    const results = await (withLandmarks ? detectionTask.withFaceLandmarks() : detectionTask)
    displayResults(this.props.overlay, results, { withBoxes })

    setTimeout(this.run, 0)
  }

  componentDidMount() {
    this.isActive = true
    this.run()
  }

  componentWillUnmount() {
    this.isActive = false
  }

  public render(): any {
    return null
  }
}