import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { EXAMPLE_IMAGES } from '../const';
import { withFaceDetections } from '../hocs/withFaceDetections';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceDetectionPageProps = {
}

type FaceDetectionPageState = {
  inputImg: ImageWrap
  minDetectionScore: number
  faceDetectionNet?: faceapi.FaceDetectionNet
  overlay?: HTMLCanvasElement
}

interface FaceDetectionProps {
  overlay?: HTMLCanvasElement
}

const FaceDetection = withFaceDetections<FaceDetectionProps>((props) => {
  if (props.overlay && props.faceDetections) {
    const { width, height } = props.overlay
    props.overlay.getContext('2d').clearRect(0, 0, width, height)
    faceapi.drawDetection(
      props.overlay,
      props.faceDetections.map(det => det.forSize(width, height))
    )
  }
  return null
})

export default class extends React.Component<FaceDetectionPageProps, FaceDetectionPageState> {

  state: FaceDetectionPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    minDetectionScore: 0.7,
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
        <SelectableImage
          items={EXAMPLE_IMAGES}
          imageSrc={this.state.inputImg.imageSrc}
          onChangeSelection={src => this.setState({ inputImg: this.state.inputImg.withImageSrc(src) })}
          onRefs={({ img, overlay }) => this.setState({ inputImg: this.state.inputImg.withImage(img), overlay })}
          maxImageWidth={800}
        />
        <FaceDetection
          img={this.state.inputImg}
          faceDetectionNet={this.state.faceDetectionNet}
          minConfidence={0.7}
          overlay={this.state.overlay}
        />
      </Root>
    )
  }
}