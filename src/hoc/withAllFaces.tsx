import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface WithAllFacesProps {
  img: ImageWrap
  children: (fullFaceDescriptions: faceapi.FullFaceDescription[] | null) => React.Component | JSX.Element
}

export interface WithAllFacesState {
  fullFaceDescriptions: faceapi.FullFaceDescription[] | null
}

type Props<DetectionParams> = WithAllFacesProps & {
  detectionParams: DetectionParams
}

export const withAllFaces = <DetectionParams extends {}> (
  allFaces: (img: HTMLImageElement, params: DetectionParams) => Promise<faceapi.FullFaceDescription[]>
) =>

  class extends React.Component<WithAllFacesProps & Props<DetectionParams>, WithAllFacesState> {

    state: WithAllFacesState = {
      fullFaceDescriptions: null
    }

    async detectFaces() {
      if (!this.props.img.isLoaded) {
        return
      }
      const fullFaceDescriptions = await allFaces(this.props.img.img, this.props.detectionParams)

      this.setState({
        fullFaceDescriptions
      })
    }

    componentDidUpdate(prevProps: Props<DetectionParams>) {
      if (
        this.props.detectionParams !== prevProps.detectionParams
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
      return this.props.children(this.state.fullFaceDescriptions)
    }
  }
