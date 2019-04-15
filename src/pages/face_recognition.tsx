import * as faceapi from 'face-api.js';
import { TinyFaceDetectorOptions, BoxWithText } from 'face-api.js';
import { LoadModels } from 'face-api.js-react';
import { DisplayResults } from 'face-api.js-react/components/DisplayResults';
import * as React from 'react';

import {
  DetectFacesWithLandmarksWithDescriptors,
} from '../../face-api.js-react/facc/DetectFacesWithLandmarksWithDescriptors';
import { MediaElement } from '../../face-api.js-react/MediaElement';
import { DisplayMatches } from '../components/DisplayMatches';
import { ModalLoader } from '../components/ModalLoader';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { EXAMPLE_IMAGES, FACE_DETECTORS, getFaceDetectionModelUri, MODELS_URI } from '../const';
import { SelectFaceDetector } from '../facc/SelectFaceDetector';
import { Root } from '../Root';

type PageState = {
  input1?: MediaElement
  overlay1?: HTMLCanvasElement
  input2?: MediaElement
  overlay2?: HTMLCanvasElement
}

export default class extends React.Component<{}, PageState> {

  state: PageState = {
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
          onLoaded={({ img : input1, overlay: overlay1 }) => this.setState({ input1, overlay1 })}
          selectionType={SelectionTypes.BOTH}
          imageStyle={{ maxWidth: 500 }}
          imgId="img1"
        />
        <SelectableImage
          items={EXAMPLE_IMAGES}
          initialImageSrc={EXAMPLE_IMAGES[3].url}
          onLoaded={({ img: input2, overlay: overlay2 }) => this.setState({ input2, overlay2 })}
          selectionType={SelectionTypes.BOTH}
          imageStyle={{ maxWidth: 500 }}
          imgId="img2"
        />
        <LoadModels
          faceLandmarkModelUrl={MODELS_URI}
          faceRecognitionModelUrl={MODELS_URI}
          renderBusyComponent={() => <ModalLoader title={`Loading Models`} />}
        >
        {() =>
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
                  input={this.state.input1}
                  detectionOptions={detectionOptions}
                >
                {({ fullFaceDescriptions: results1 }) => {
                  if (!results1.length) {
                    return null
                  }

                  const faceMatcher = new faceapi.FaceMatcher(results1)
                  const { overlay1 } = this.state

                  return (
                    <DetectFacesWithLandmarksWithDescriptors
                      input={this.state.input2}
                      detectionOptions={detectionOptions}
                    >
                    {({ fullFaceDescriptions: results2 }) =>
                      <span>
                        <DisplayResults
                          input={this.state.input1}
                          overlay={overlay1}
                          results={
                            faceMatcher.labeledDescriptors.map((ld, idx) =>
                              new BoxWithText(
                                results1[idx].detection.forSize(overlay1.width, overlay1.height).box,
                                ld.label
                              )
                            )
                          }
                        />
                        <DisplayMatches
                          input={this.state.input2}
                          fullFaceDescriptions={results2}
                          overlay={this.state.overlay2}
                          getBestMatch={(desc) => faceMatcher.findBestMatch(desc)}
                          withScore
                        />
                      </span>
                    }
                    </DetectFacesWithLandmarksWithDescriptors>
                  )
                }}
                </DetectFacesWithLandmarksWithDescriptors>
              </div>
            }
            </LoadModels>
          }
          </SelectFaceDetector>
        }
        </LoadModels>
      </Root>
    )
  }
}