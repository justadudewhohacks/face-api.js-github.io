import { withPrefix } from 'gatsby-link';
import * as React from 'react';

import { DisplayFullFaceDescriptions } from '../components/DisplayFullFaceDescriptions';
import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES_BY_CLASS, EXAMPLE_IMAGES } from '../const';
import { AllFaces } from '../facc/AllFaces';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceRecognitionPageState = {
  inputImg: ImageWrap
  minDetectionScore: number
  overlay?: HTMLCanvasElement
}

const REF_DATA_SOURCES = ALIGNED_FACE_IMAGES_BY_CLASS.map(srcsByClass => srcsByClass[0])

export default class extends React.Component<{}, FaceRecognitionPageState> {

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
          faceDetectionModelUrl={withPrefix('/models')}
          faceLandmarkModelUrl={withPrefix('/models')}
          faceRecognitionModelUrl={withPrefix('/models')}
        >
        {
          ({ faceRecognitionNet }) =>
            <ComputeRefDescriptors
              faceRecognitionNet={faceRecognitionNet}
              refDataSources={REF_DATA_SOURCES}
            >
            {
              ({ getBestMatch }) =>
                <AllFaces
                  img={this.state.inputImg}
                  detectionParams={{
                    minConfidence: this.state.minDetectionScore
                  }}
                >
                {
                  ({ fullFaceDescriptions }) =>
                    <DisplayFullFaceDescriptions
                      fullFaceDescriptions={fullFaceDescriptions}
                      overlay={this.state.overlay}
                      getBestMatch={getBestMatch}
                      withScore
                    />
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