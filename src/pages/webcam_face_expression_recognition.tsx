import { TinyFaceDetectorOptions } from 'face-api.js';
import * as React from 'react';

import { MediaElement } from '../../face-api.js-react/MediaElement';
import { FaceDetection } from '../components/FaceDetection';
import { TrackFacesWithExpressions } from '../components/TrackFacesWithExpressions';
import { WebcamVideoWithOverlay } from '../components/WebcamVideoWithOverlay';
import { FACE_DETECTORS } from '../const';
import { Root } from '../Root';

type PageState = {
  input?: MediaElement
  overlay?: HTMLCanvasElement
  withLandmarks: boolean
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
        <FaceDetection
          {...this.state}
          initialFaceDetector={FACE_DETECTORS[0]}
          initialTinyFaceDetectorOptions={new TinyFaceDetectorOptions({ inputSize: 224 })}
        >
        {(detectionOptions, withBoxes) =>
          <TrackFacesWithExpressions
            detectionOptions={detectionOptions}
            withBoxes={withBoxes}
            {...this.state}
          />
        }
        </FaceDetection>
      </Root>
    )
  }
}