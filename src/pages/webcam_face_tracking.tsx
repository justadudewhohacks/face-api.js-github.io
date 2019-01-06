import { TinyFaceDetectorOptions } from 'face-api.js';
import * as React from 'react';

import { MediaElement } from '../../face-api.js-react/MediaElement';
import { FaceAndLandmarkDetection } from '../components/FaceAndLandmarkDetection';
import { TrackFacesWithLandmarks } from '../components/TrackFacesWithLandmarks';
import { WebcamVideoWithOverlay } from '../components/WebcamVideoWithOverlay';
import { FACE_DETECTORS } from '../const';
import { Root } from '../Root';

type PageState = {
  input?: MediaElement
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, PageState> {

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <WebcamVideoWithOverlay
          onLoaded={({ video: input, overlay }) => this.setState({ input, overlay })}
          maxVideoWidth={800}
        />
        <FaceAndLandmarkDetection
          {...this.state}
          initialFaceDetector={FACE_DETECTORS[0]}
          initialTinyFaceDetectorOptions={new TinyFaceDetectorOptions({ inputSize: 224 })}
        >
        {(detectionOptions, withBoxes, withLandmarks) =>
          <TrackFacesWithLandmarks
            detectionOptions={detectionOptions}
            withBoxes={withBoxes}
            withLandmarks={withLandmarks}
            {...this.state}
          />
        }
        </FaceAndLandmarkDetection>
      </Root>
    )
  }
}