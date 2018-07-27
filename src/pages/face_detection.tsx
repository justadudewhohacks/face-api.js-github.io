import * as faceapi from 'face-api.js';
import { withPrefix } from 'gatsby-link';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { EXAMPLE_IMAGES } from '../const';
import { DetectFaces } from '../facc/DetectFaces';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceDetectionPageState = {
  inputImg: ImageWrap
  minDetectionScore: number
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceDetectionPageState> {

  state: FaceDetectionPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    minDetectionScore: 0.5,
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <SelectableImage
          items={EXAMPLE_IMAGES}
          initialImageSrc={this.state.inputImg.imageSrc}
          onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
          maxImageWidth={800}
        />
        <LoadModels faceDetectionModelUrl={withPrefix('/models')}>
        {
          ({ faceDetectionNet }) =>
            <DetectFaces
              faceDetectionNet={faceDetectionNet}
              img={this.state.inputImg}
              minConfidence={this.state.minDetectionScore}
            >
            {
              ({ faceDetections }) => {
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