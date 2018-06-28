import * as faceapi from 'face-api.js';
import * as React from 'react';

import { FaceDetection } from '../components/FaceDetection';
import { ImageSelection } from '../components/ImageSelection';
import { Root } from '../Root';

type FaceDetectionPageProps = {
}

type FaceDetectionPageState = {
  minDetectionScore: number
  selectedImage: string
  faceDetectionNet?: faceapi.FaceDetectionNet
}

const SELECTABLE_ITEMS = [1, 2, 3, 4, 5].map(idx => `images/bbt${idx}.jpg`)

export default class extends React.Component<FaceDetectionPageProps, FaceDetectionPageState> {
  state: FaceDetectionPageState = {
    minDetectionScore: 0.5,
    selectedImage: SELECTABLE_ITEMS[0]
  }

  async loadModels() {
    const faceDetectionNet = new faceapi.FaceDetectionNet()
    await faceDetectionNet.load('models')
    this.setState({ faceDetectionNet })
  }

  componentWillMount() {
    if (typeof window != 'undefined' && window.document) {
      this.loadModels()
    }
  }

  public render() {
    return(
      <Root>
        <FaceDetection
          faceDetectionNet={this.state.faceDetectionNet}
          imageSrc={this.state.selectedImage}
          minDetectionScore={this.state.minDetectionScore}
          maxImageWidth={800}
        />
        <ImageSelection
          items={SELECTABLE_ITEMS}
          selectedImage={this.state.selectedImage}
          onChange={(selectedImage: string) => this.setState({ selectedImage })}
        />
      </Root>
    )
  }
}