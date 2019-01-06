import { TinyFaceDetectorOptions } from 'face-api.js';
import { DisplayResults } from 'face-api.js-react/components/DisplayResults';
import * as React from 'react';

import { DetectFaces } from '../../face-api.js-react/facc/DetectFaces';
import { DetectFacesWithLandmarks } from '../../face-api.js-react/facc/DetectFacesWithLandmarks';
import { FaceAndLandmarkDetection, FaceAndLandmarkDetectionProps } from '../components/FaceAndLandmarkDetection';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { EXAMPLE_IMAGES, FACE_DETECTORS } from '../const';
import { Root } from '../Root';

type PageState = FaceAndLandmarkDetectionProps

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
          onLoaded={({ img: input, overlay }) => this.setState({ input, overlay })}
          selectionType={SelectionTypes.BOTH}
          imageStyle={{ maxWidth: 800 }}
          imgId="img"
        />
        <FaceAndLandmarkDetection
          {...this.state}
          initialFaceDetector={FACE_DETECTORS[0]}
          initialTinyFaceDetectorOptions={new TinyFaceDetectorOptions({ inputSize: 512 })}
        >
        {(detectionOptions, withBoxes, withLandmarks) =>
          withLandmarks
            ?
              <DetectFacesWithLandmarks
                input={this.state.input}
                detectionOptions={detectionOptions}
              >
              {({ faceDetectionsWithLandmarks }) =>
                <DisplayResults
                  input={this.state.input}
                  overlay={this.state.overlay}
                  results={faceDetectionsWithLandmarks}
                  displayResultsOptions={{ withBoxes }}
                />
              }
              </DetectFacesWithLandmarks>
            :
              <DetectFaces
                input={this.state.input}
                detectionOptions={detectionOptions}
              >
              {({ faceDetections }) =>
                <DisplayResults
                  input={this.state.input}
                  overlay={this.state.overlay}
                  results={faceDetections}
                  displayResultsOptions={{ withBoxes }}
                />
              }
              </DetectFaces>
        }
        </FaceAndLandmarkDetection>
      </Root>
    )
  }
}