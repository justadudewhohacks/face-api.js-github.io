import * as faceapi from 'face-api.js';
import * as React from 'react';

import { displayResults } from '../../face-api.js-react';
import { DisplayResultsOptions } from '../../face-api.js-react/displayResults';
import { MediaElement } from '../../face-api.js-react/MediaElement';

export type TrackFacesProps = {
  input?: MediaElement
  overlay?: HTMLCanvasElement
  displayOptions?: DisplayResultsOptions
  runTask: () => Promise<
    faceapi.FaceDetection[]
    | faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>[]
    | faceapi.WithFaceExpressions<faceapi.WithFaceDetection<{}>>[]
  >
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

    const results = await this.props.runTask()
    displayResults(this.props.input, this.props.overlay, results, this.props.displayOptions)

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