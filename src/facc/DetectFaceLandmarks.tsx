import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface DetectFaceLandmarksProps {
  faceLandmarkNet: faceapi.FaceLandmarkNet
  imgs: ImageWrap[]
  children: (faceLandmarks: faceapi.FaceLandmarks68[] | null) => React.Component | JSX.Element
}

export interface DetectFaceLandmarksState {
  faceLandmarks: faceapi.FaceLandmarks68[] | null
}

export class DetectFaceLandmarks extends React.Component<DetectFaceLandmarksProps, DetectFaceLandmarksState> {

    state: DetectFaceLandmarksState = {
      faceLandmarks: null
    }

    async detectFaceLandmarks() {
      if (!this.props.imgs.every(img => img.isLoaded)) {
        return
      }

      const faceLandmarks = await Promise.all(
        this.props.imgs.map(({ img }) => {
          return this.props.faceLandmarkNet.detectLandmarks(img) as Promise<faceapi.FaceLandmarks68>
        })
      )

      this.setState({
        faceLandmarks
      })
    }

    componentDidUpdate(prevProps: DetectFaceLandmarksProps) {
      if (
        this.props.faceLandmarkNet !== prevProps.faceLandmarkNet
          || this.props.imgs !== prevProps.imgs
          || this.props.children !== prevProps.children
      ) {
        this.detectFaceLandmarks()
      }
    }

    componentDidMount() {
      this.detectFaceLandmarks()
    }

    render() {
      return this.props.children(this.state.faceLandmarks)
    }
  }
