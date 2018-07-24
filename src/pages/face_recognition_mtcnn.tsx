import * as React from 'react';

import { DisplayFullFaceDescriptions } from '../components/DisplayFullFaceDescriptions';
import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES_BY_CLASS, EXAMPLE_IMAGES } from '../const';
import { AllFacesMtcnn } from '../facc/AllFacesMtcnn';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceRecognitionPageProps = {
}

type FaceRecognitionPageState = {
  inputImg: ImageWrap
  minFaceSize: number
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<FaceRecognitionPageProps, FaceRecognitionPageState> {

  state: FaceRecognitionPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    minFaceSize: 40
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
          mtcnnModelUrl="models"
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
                <AllFacesMtcnn
                  img={this.state.inputImg}
                  detectionParams={{
                    minFaceSize: this.state.minFaceSize
                  }}
                >
                {
                  fullFaceDescriptions =>
                    <DisplayFullFaceDescriptions
                      fullFaceDescriptions={fullFaceDescriptions}
                      overlay={this.state.overlay}
                      getBestMatch={getBestMatch}
                      drawLandmarks
                    />
                }
                </AllFacesMtcnn>
            }
            </ComputeRefDescriptors>
        }
        </LoadModels>
      </Root>
    )
  }
}