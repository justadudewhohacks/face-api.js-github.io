import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface ComputeFaceDescriptorsProps {
  faceRecognitionNet: faceapi.FaceRecognitionNet
  imgs: ImageWrap[]
  children: (faceDescriptors: Float32Array[]) => React.Component | JSX.Element
}

export interface ComputeFaceDescriptorsState {
  faceDescriptors: Float32Array[] | null
}

export class ComputeFaceDescriptors extends React.Component<ComputeFaceDescriptorsProps, ComputeFaceDescriptorsState> {

    state: ComputeFaceDescriptorsState = {
      faceDescriptors: null
    }

    async computeDescriptors(prevImgs?: ImageWrap[]) {

      const faceDescriptors = await Promise.all(
        this.props.imgs.map((imgWrap, idx) => {
          if (this.state.faceDescriptors && prevImgs && imgWrap === prevImgs[idx]) {
            return Promise.resolve(this.state.faceDescriptors[idx])
          }
          return this.props.faceRecognitionNet.computeFaceDescriptor(imgWrap.img) as Promise<Float32Array>
        })
      )

      this.setState({
        faceDescriptors
      })
    }

    componentDidUpdate(prevProps: ComputeFaceDescriptorsProps) {
      if (
        this.props.faceRecognitionNet !== prevProps.faceRecognitionNet
          || this.props.imgs !== prevProps.imgs
          || this.props.children !== prevProps.children
      ) {
        this.computeDescriptors(prevProps.imgs)
      }
    }

    componentDidMount() {
      this.computeDescriptors()
    }

    render() {
      return this.props.children(this.state.faceDescriptors)
    }
  }
