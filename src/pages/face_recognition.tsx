import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES_BY_CLASS, EXAMPLE_IMAGES } from '../const';
import { AllFaces } from '../facc/AllFaces';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceRecognitionPageProps = {
}

type FaceRecognitionPageState = {
  inputImg: ImageWrap
  minDetectionScore: number
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<FaceRecognitionPageProps, FaceRecognitionPageState> {

  state: FaceRecognitionPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    minDetectionScore: 0.5
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
        <LoadModels
          faceDetectionModelUrl="models"
          faceLandmarkModelUrl="models"
          faceRecognitionModelUrl="models"
        >
        {
          ({ faceRecognitionNet }) =>
            <ComputeRefDescriptors
              faceRecognitionNet={faceRecognitionNet}
              refDataSources={ALIGNED_FACE_IMAGES_BY_CLASS.map(srcsByClass => srcsByClass[0])}
            >
            {
              getBestMatch =>
                <AllFaces
                  img={this.state.inputImg}
                  minConfidence={this.state.minDetectionScore}
                >
                {
                  (fullFaceDescriptions) => {
                    const { overlay } = this.state
                    if (!fullFaceDescriptions || !overlay) {
                      return null
                    }

                    const { width, height } = overlay
                    overlay.getContext('2d').clearRect(0, 0, width, height)

                    const faceDetections = fullFaceDescriptions.map(fd => fd.detection.forSize(width, height))

                    faceapi.drawDetection(
                      overlay,
                      faceDetections
                    )

                    fullFaceDescriptions.forEach(({ detection, descriptor }) => {
                      const bestMatch = getBestMatch(descriptor)
                      const text = `${bestMatch.distance < 0.6 ? bestMatch.label : 'unknown'} (${faceapi.round(bestMatch.distance)})`
                      const { x, y, height: boxHeight } = detection.forSize(width, height).getBox()
                      faceapi.drawText(
                        overlay.getContext('2d'),
                        x,
                        y + boxHeight,
                        text,
                        Object.assign(faceapi.getDefaultDrawOptions(), { color: 'red', fontSize: 16 })
                      )
                    })
                    return null
                  }
                }
                </AllFaces>
            }
            </ComputeRefDescriptors>
        }
        </LoadModels>
      </Root>
    )
  }
}