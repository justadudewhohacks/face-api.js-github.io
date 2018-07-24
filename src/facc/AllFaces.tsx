import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWrap } from '../ImageWrap';

export interface AllFacesProps {
  img: ImageWrap
  minConfidence: number
  children: (fullFaceDescriptions: faceapi.FullFaceDescription[] | null) => React.Component | JSX.Element
}

export interface AllFacesState {
  fullFaceDescriptions: faceapi.FullFaceDescription[] | null
}

export class AllFaces extends React.Component<AllFacesProps, AllFacesState> {

    state: AllFacesState = {
      fullFaceDescriptions: null
    }

    async detectFaces() {
      if (!this.props.img.isLoaded) {
        return
      }
      const fullFaceDescriptions = await faceapi.allFaces(this.props.img.img, this.props.minConfidence)

      this.setState({
        fullFaceDescriptions
      })
    }

    componentDidUpdate(prevProps: AllFacesProps) {
      if (
        this.props.minConfidence !== prevProps.minConfidence
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
