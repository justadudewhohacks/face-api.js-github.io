import { TinyFaceDetectorOptions } from 'face-api.js';
import * as React from 'react';

import { LoadModels } from '../../face-api.js-react/facc/LoadModels';
import { MediaElement } from '../../face-api.js-react/MediaElement';
import { FaceDetection } from '../components/FaceDetection';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { TrackFacesWithExpressions } from '../components/TrackFacesWithExpressions';
import { EXAMPLE_IMAGES, EXAMPLE_IMAGES_FACE_EXPRESSIONS, FACE_DETECTORS, MODELS_URI } from '../const';
import { Root } from '../Root';

type PageState = {
  input?: MediaElement
  overlay?: HTMLCanvasElement
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
          items={EXAMPLE_IMAGES_FACE_EXPRESSIONS.concat(EXAMPLE_IMAGES)}
          initialImageSrc={EXAMPLE_IMAGES_FACE_EXPRESSIONS[0].url}
          onLoaded={({ img: input, overlay }) => this.setState({ input, overlay })}
          selectionType={SelectionTypes.BOTH}
          imageStyle={{ maxWidth: 800 }}
          imgId="img"
        />
        <LoadModels
          ssdMobilenetv1ModelUrl={MODELS_URI}
          faceExpessionModelUrl={MODELS_URI}
        >
        {
          () =>
            <FaceDetection
              {...this.state}
              initialFaceDetector={FACE_DETECTORS[1]}
              initialTinyFaceDetectorOptions={new TinyFaceDetectorOptions({ inputSize: 512 })}
            >
            {(detectionOptions, withBoxes) =>
              <TrackFacesWithExpressions
                detectionOptions={detectionOptions}
                withBoxes={withBoxes}
                {...this.state}
              />
            }
            </FaceDetection>
        }
        </LoadModels>
      </Root>
    )
  }
}