import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { EXAMPLE_IMAGES } from '../const';
import { withFaceDetections, WithFaceDetectionsProps } from '../hocs/withFaceDetections';
import { withModels } from '../hocs/withModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceDetectionPageProps = {
  faceDetectionNet: faceapi.FaceDetectionNet | null
  faceLandmarkNet: faceapi.FaceLandmarkNet | null
  faceRecognitionNet: faceapi.FaceRecognitionNet | null
}

type FaceDetectionPageState = {
  inputImg: ImageWrap
  minDetectionScore: number
  overlay?: HTMLCanvasElement
}

interface FaceDetectionProps {
  overlay?: HTMLCanvasElement
}

const FaceDetection = withModels<FaceDetectionProps & WithFaceDetectionsProps>(
  withFaceDetections<FaceDetectionProps>(
    (props) => {
      if (props.overlay && props.faceDetections) {
        const { width, height } = props.overlay
        props.overlay.getContext('2d').clearRect(0, 0, width, height)
        faceapi.drawDetection(
          props.overlay,
          props.faceDetections.map(det => det.forSize(width, height))
        )
      }
      return null
    }
  )
)

export default class extends React.Component<FaceDetectionPageProps, FaceDetectionPageState> {

  state: FaceDetectionPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    minDetectionScore: 0.7,
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

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
          faceDetectionModelUrl="models"
          img={this.state.inputImg}
          minConfidence={0.7}
          overlay={this.state.overlay}
        />
      </Root>
    )
  }
}