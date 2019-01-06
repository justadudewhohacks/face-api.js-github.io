import * as faceapi from 'face-api.js';
import * as React from 'react';

import { MediaElement } from '../../face-api.js-react';
import { FaceDetectionOptions } from 'face-api.js';
import { TrackFaces } from './TrackFaces';

export type TrackFacesWithExpressionsProps = {
  input?: MediaElement
  detectionOptions: FaceDetectionOptions
  withBoxes: boolean
}

export class TrackFacesWithExpressions extends React.Component<TrackFacesWithExpressionsProps> {
  public render(): any {
    const { withBoxes } = this.props
    return (
      <TrackFaces
        {...this.props}
        displayOptions={{ withBoxes, withScore: false }}
        runTask={async () => faceapi.detectAllFaces(this.props.input.element, this.props.detectionOptions).withFaceExpressions()}
      />
    )
  }
}