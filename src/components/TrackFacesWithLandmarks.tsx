import * as faceapi from 'face-api.js';
import * as React from 'react';

import { MediaElement } from '../../face-api.js-react';
import { FaceDetectionOptions } from 'face-api.js';
import { TrackFaces } from './TrackFaces';

export type TrackFacesWithLandmarksProps = {
  input?: MediaElement
  detectionOptions: FaceDetectionOptions
  withBoxes: boolean
  withLandmarks: boolean
}

export class TrackFacesWithLandmarks extends React.Component<TrackFacesWithLandmarksProps> {
  public render(): any {
    const runTask = async () => {
      let task = faceapi.detectAllFaces(this.props.input.element, this.props.detectionOptions)
      if (this.props.withLandmarks) {
        return task.withFaceLandmarks()
      }
      return task
    }

    return (
      <TrackFaces
        {...this.props}
        withBoxes={this.props.withBoxes}
        runTask={runTask}
      />
    )
  }
}