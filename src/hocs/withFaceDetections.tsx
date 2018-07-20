import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface WithFaceDetectionsProps {
  img: ImageWrap
  minConfidence: number
  faceDetectionNet?: faceapi.FaceDetectionNet
}

export interface WithFaceDetectionsState {
  faceDetections: faceapi.FaceDetection[] | null
}

export interface WithFaceDetectionsInjectedProps extends WithFaceDetectionsState{}

export const withFaceDetections = <InputProps extends {}>(
  Component: React.ComponentType<InputProps & WithFaceDetectionsInjectedProps>
) =>
  class WithFaceDetections extends React.Component<InputProps & WithFaceDetectionsProps, WithFaceDetectionsState> {

    state: WithFaceDetectionsState = {
      faceDetections: null
    }

    async componentDidUpdate(prevProps: WithFaceDetectionsProps) {
      if (
        this.props === prevProps
          || !this.props.faceDetectionNet
          || !this.props.img.isLoaded
      ) {
        return
      }
      const faceDetections = await this.props.faceDetectionNet.locateFaces(this.props.img.img, this.props.minConfidence)

      this.setState({
        faceDetections
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          faceDetections={this.state.faceDetections}
        />
      );
    }
  };
