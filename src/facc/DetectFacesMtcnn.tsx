import * as faceapi from 'face-api.js';
import * as React from 'react';

import { MtcnnForwardParams, MtcnnResult } from '../../node_modules/face-api.js/build/mtcnn/types';
import { ImageWrap } from '../ImageWrap';
import { VideoWrap } from '../VideoWrap';

export interface DetectFacesMtcnnProps {
  mtcnn: faceapi.Mtcnn
  input: ImageWrap | VideoWrap
  detectionParams: MtcnnForwardParams
  children: (mtcnnResults: MtcnnResult[] | null) => React.Component | JSX.Element
}

export interface DetectFacesMtcnnState {
  mtcnnResults: MtcnnResult[] | null
}

export class DetectFacesMtcnn extends React.Component<DetectFacesMtcnnProps, DetectFacesMtcnnState> {

    state: DetectFacesMtcnnState = {
      mtcnnResults: null
    }

    async detectFaces() {
      if (!this.props.input.isLoaded) {
        return
      }

      const mtcnnResults = await this.props.mtcnn.forward(this.props.input.element, this.props.detectionParams)

      this.setState({
        mtcnnResults
      })
    }

    componentWillReceiveProps(nextProps: DetectFacesMtcnnProps) {
      if (
        this.props.mtcnn !== nextProps.mtcnn
          || this.props.detectionParams !== nextProps.detectionParams
          || this.props.input !== nextProps.input
          || this.props.children !== nextProps.children
      ) {
        this.detectFaces()
      }
    }

    componentDidMount() {
      this.detectFaces()
    }

    shouldComponentUpdate(_: any, nextState: DetectFacesMtcnnState) {
      return this.state.mtcnnResults !== nextState.mtcnnResults
    }

    render() {
      return this.props.children(this.state.mtcnnResults)
    }
  }
