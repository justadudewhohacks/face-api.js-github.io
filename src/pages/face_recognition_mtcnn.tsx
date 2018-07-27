import { withPrefix } from 'gatsby-link';
import * as React from 'react';

import { AdjustableInput } from '../components/AdjustableInput';
import { DisplayFullFaceDescriptions } from '../components/DisplayFullFaceDescriptions';
import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES_BY_CLASS, EXAMPLE_IMAGES } from '../const';
import { AllFacesMtcnn } from '../facc/AllFacesMtcnn';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceRecognitionMtcnnPageState = {
  inputImg: ImageWrap
  detectionParams: {
    minFaceSize: number
  }
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, FaceRecognitionMtcnnPageState> {

  state: FaceRecognitionMtcnnPageState = {
    inputImg: new ImageWrap(EXAMPLE_IMAGES[0].url),
    detectionParams: {
      minFaceSize: 40
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
        <AdjustableInput
          inputId="minFaceSize"
          label="minFaceSize:"
          value={this.state.detectionParams.minFaceSize}
          minValue={20}
          maxValue={200}
          step={20}
          onChange={
            (minFaceSize: number) => this.setState({
              detectionParams: { ...this.state.detectionParams, minFaceSize }
            })
          }
        />
        <LoadModels
          mtcnnModelUrl={withPrefix('/models')}
          faceRecognitionModelUrl={withPrefix('/models')}
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
                  detectionParams={this.state.detectionParams}
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