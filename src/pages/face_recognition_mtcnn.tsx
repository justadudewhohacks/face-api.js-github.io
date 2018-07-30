import * as React from 'react';

import { MtcnnForwardParams } from '../../node_modules/face-api.js/build/mtcnn/types';
import { DisplayFullFaceDescriptions } from '../components/DisplayFullFaceDescriptions';
import { ModalLoader } from '../components/ModalLoader';
import { MtcnnParamControls } from '../components/MtcnnParamControls';
import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES_BY_CLASS, EXAMPLE_IMAGES, MODELS_URI } from '../const';
import { AllFacesMtcnn } from '../facc/AllFacesMtcnn';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceRecognitionMtcnnPageState = {
  inputImg: ImageWrap
  detectionParams: MtcnnForwardParams
  overlay?: HTMLCanvasElement
}

const REF_DATA_SOURCES = ALIGNED_FACE_IMAGES_BY_CLASS.map(srcsByClass => srcsByClass[0])

export default class extends React.Component<{}, FaceRecognitionMtcnnPageState> {

  state: FaceRecognitionMtcnnPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    detectionParams: {
      minFaceSize: 40,
      scaleFactor: 0.7
    }
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
        <MtcnnParamControls
          detectionParams={this.state.detectionParams}
          onChange={detectionParams => this.setState({ detectionParams })}
        />
        <LoadModels
          mtcnnModelUrl={MODELS_URI}
          faceRecognitionModelUrl={MODELS_URI}
        >
        {
          ({ faceRecognitionNet }) =>
            <ComputeRefDescriptors
              faceRecognitionNet={faceRecognitionNet}
              refDataSources={REF_DATA_SOURCES}
            >
            {
            ({ getBestMatch }) =>
                <AllFacesMtcnn
                  img={this.state.inputImg}
                  detectionParams={this.state.detectionParams}
                >
                {
                  ({ fullFaceDescriptions, isBusy }) =>
                    isBusy
                      ? <ModalLoader title="Computing"/>
                      :
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