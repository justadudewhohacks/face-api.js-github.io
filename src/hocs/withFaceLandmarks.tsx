import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface WithFaceLandmarksProps {
  imgs: ImageWrap[]
  faceLandmarkNet: faceapi.FaceLandmarkNet | undefined
}

export interface WithFaceLandmarksState {
  faceLandmarks: faceapi.FaceLandmarks[] | null
}

export interface WithFaceLandmarksInjectedProps extends WithFaceLandmarksState{}

export const withFaceLandmarks = <InputProps extends {}>(
  Component: React.ComponentType<InputProps & WithFaceLandmarksInjectedProps>
) =>
  class WithFaceLandmarks extends React.Component<InputProps & WithFaceLandmarksProps, WithFaceLandmarksState> {

    state: WithFaceLandmarksState = {
      faceLandmarks: null
    }

    async componentDidUpdate(prevProps: WithFaceLandmarksProps) {
      if (
        this.props === prevProps
          || !this.props.faceLandmarkNet
          || !this.props.imgs.every(img => img.isLoaded())
      ) {
        return
      }

      const faceLandmarks = await Promise.all(
        this.props.imgs.map(({ img, imageSrc }, idx) => {
          if (this.state.faceLandmarks && imageSrc === prevProps.imgs[idx].imageSrc) {
            return Promise.resolve(this.state.faceLandmarks[idx])
          }
          return this.props.faceLandmarkNet.detectLandmarks(img)
        })
      )

      this.setState({
        faceLandmarks
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          faceLandmarks={this.state.faceLandmarks}
        />
      );
    }
  };
