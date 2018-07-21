import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface DetectFacesProps {
  faceDetectionNet: faceapi.FaceDetectionNet
  img: ImageWrap
  minConfidence: number
  children: (faceDetections: faceapi.FaceDetection[] | null) => React.Component | JSX.Element
}

export interface DetectFacesState {
  faceDetections: faceapi.FaceDetection[] | null
}

export class DetectFaces extends React.Component<DetectFacesProps, DetectFacesState> {

    state: DetectFacesState = {
      faceDetections: null
    }

    async detectFaces() {
      const faceDetections = await this.props.faceDetectionNet.locateFaces(this.props.img.img, this.props.minConfidence)

      this.setState({
        faceDetections
      })
    }

    componentDidUpdate(prevProps: DetectFacesProps) {
      if (
        this.props.faceDetectionNet !== prevProps.faceDetectionNet
          || this.props.minConfidence !== prevProps.minConfidence
          || this.props.img !== prevProps.img
          || this.props.children !== prevProps.children
      ) {
        this.detectFaces()
      }
    }

    componentDidMount() {
      this.detectFaces()
    }

    render() {
      return this.props.children(this.state.faceDetections)
    }
  }
