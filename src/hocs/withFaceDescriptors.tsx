import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface WithFaceDescriptorsProps {
  imgs: ImageWrap[]
  faceRecognitionNet: faceapi.FaceRecognitionNet | undefined
}

export interface WithFaceDescriptorsState {
  faceDescriptors: Float32Array[] | null
}

export interface WithFaceDescriptorsInjectedProps extends WithFaceDescriptorsState{}

export const withFaceDescriptors = <InputProps extends {}>(
  Component: React.ComponentType<InputProps & WithFaceDescriptorsInjectedProps>
) =>
  class WithFaceDescriptors extends React.Component<InputProps & WithFaceDescriptorsProps, WithFaceDescriptorsState> {

    state: WithFaceDescriptorsState = {
      faceDescriptors: null
    }

    async componentDidUpdate(prevProps: WithFaceDescriptorsProps) {
      if (
        this.props === prevProps
          || !this.props.faceRecognitionNet
          || !this.props.imgs.every(img => img.isLoaded())
      ) {
        return
      }

      const faceDescriptors = await Promise.all(
        this.props.imgs.map(({ img, imageSrc }, idx) => {
          if (this.state.faceDescriptors && imageSrc === prevProps.imgs[idx].imageSrc) {
            return Promise.resolve(this.state.faceDescriptors[idx])
          }
          return this.props.faceRecognitionNet.computeFaceDescriptor(img)
        })
      )

      this.setState({
        faceDescriptors
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          faceDescriptors={this.state.faceDescriptors}
        />
      );
    }
  };
