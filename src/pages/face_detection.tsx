import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { EXAMPLE_IMAGES } from '../const';
import { DetectFaces } from '../facc/DetectFaces';
import { LoadModels } from '../facc/LoadModels';
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
        <LoadModels faceDetectionModelUrl="models">
        {
          ({ faceDetectionNet }) =>
            <DetectFaces
              faceDetectionNet={faceDetectionNet}
              img={this.state.inputImg}
              minConfidence={0.7}
            >
            {
              (faceDetections) => {
                const { overlay } = this.state

                if (overlay && faceDetections) {
                  const { width, height } = overlay
                  overlay.getContext('2d').clearRect(0, 0, width, height)
                  faceapi.drawDetection(
                    overlay,
                    faceDetections.map(det => det.forSize(width, height))
                  )
                }

                return null
              }
            }
            </DetectFaces>
        }
        </LoadModels>
      </Root>
    )
  }
}