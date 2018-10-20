import { TinyFaceDetectorOptions } from 'face-api.js';
import { LoadModels, MediaElement } from 'face-api.js-react';
import * as React from 'react';

import {
  DetectFacesWithLandmarksWithDescriptors,
} from '../../face-api.js-react/facc/DetectFacesWithLandmarksWithDescriptors';
import { DisplayMatches } from '../components/DisplayMatches';
import { ModalLoader } from '../components/ModalLoader';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import {
  ALIGNED_FACE_IMAGES_BY_CLASS,
  EXAMPLE_IMAGES,
  FACE_DETECTORS,
  getFaceDetectionModelUri,
  MODELS_URI,
} from '../const';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { SelectFaceDetector } from '../facc/SelectFaceDetector';
import { Root } from '../Root';

const REF_DATA_SOURCES = ALIGNED_FACE_IMAGES_BY_CLASS.map(srcsByClass => srcsByClass[0])

type PageState = {
  inputImg?: MediaElement
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, PageState> {

  state: PageState = {
  }

  onTabIndexChanged = () => {
    this.setState({ inputImg: undefined })
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <SelectableImage
          items={EXAMPLE_IMAGES}
          initialImageSrc={EXAMPLE_IMAGES[0].url}
          onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
          selectionType={SelectionTypes.BOTH}
          imageStyle={{ maxWidth: 800 }}
          imgId="img"
        />
        <LoadModels
          faceLandmarkModelUrl={MODELS_URI}
          faceRecognitionModelUrl={MODELS_URI}
          renderBusyComponent={() => <ModalLoader title={`Loading Models`} />}
        >
        {() =>
          <ComputeRefDescriptors
            refDataSources={REF_DATA_SOURCES}
            renderBusyComponent={
              () => <ModalLoader title="Computing Reference Descriptors"/>
            }
          >
          {({ getBestMatch }) =>
            <SelectFaceDetector
              initialFaceDetector={FACE_DETECTORS[0]}
              initialTinyFaceDetectorOptions={new TinyFaceDetectorOptions({ inputSize: 512 })}
            >
            {(detectorName, detectionOptions, renderFaceDetectorSelection, renderFaceDetectorControls) =>
              <LoadModels
                {...getFaceDetectionModelUri(detectorName, MODELS_URI)}
                renderBusyComponent={() => <ModalLoader title={`Loading ${detectorName} Model`} />}
              >
              {() =>
                <div>
                  { renderFaceDetectorSelection() }
                  { renderFaceDetectorControls() }
                  <DetectFacesWithLandmarksWithDescriptors
                    input={this.state.inputImg}
                    detectionOptions={detectionOptions}
                  >
                  {({ fullFaceDescriptions }) =>
                    <DisplayMatches
                      input={this.state.inputImg}
                      fullFaceDescriptions={fullFaceDescriptions}
                      overlay={this.state.overlay}
                      getBestMatch={getBestMatch}
                      withScore
                    />
                  }
                  </DetectFacesWithLandmarksWithDescriptors>
                </div>
              }
              </LoadModels>
            }
            </SelectFaceDetector>
          }
          </ComputeRefDescriptors>
        }
        </LoadModels>
      </Root>
    )
  }
}