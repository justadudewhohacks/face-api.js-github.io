import * as faceapi from 'face-api.js';
import * as React from 'react';

import { FaceSimilarity } from '../components/FaceSimilarity';
import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES, MODELS_URI } from '../const';
import { ComputeFaceDescriptors } from '../facc/ComputeFaceDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { MediaElement } from '../MediaElement';
import { Root } from '../Root';
import { MarginTop } from '../styled/MarginTop';
import { SideBySide } from '../styled/SideBySide';

type FaceSimilarityPageState = {
  inputImg1?: MediaElement
  inputImg2?: MediaElement
}

export default class extends React.Component<{}, FaceSimilarityPageState> {

  state: FaceSimilarityPageState = {
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <SideBySide>
          <SelectableImage
            items={ALIGNED_FACE_IMAGES}
            initialImageSrc={ALIGNED_FACE_IMAGES[30].url}
            onLoaded={({ img: inputImg1 }) => this.setState({ inputImg1 })}
            maxImageWidth={150}
          />
          <SelectableImage
            items={ALIGNED_FACE_IMAGES}
            initialImageSrc={ALIGNED_FACE_IMAGES[31].url}
            onLoaded={({ img: inputImg2 }) => this.setState({ inputImg2 })}
            maxImageWidth={150}
          />
        </SideBySide>
        <MarginTop>
          <LoadModels faceRecognitionModelUrl={MODELS_URI}>
            {
              ({ faceRecognitionNet }) =>
                <ComputeFaceDescriptors
                  inputs={[this.state.inputImg1, this.state.inputImg2]}
                  faceRecognitionNet={faceRecognitionNet}
                >
                {
                  ({ faceDescriptors }) => {
                    if (!faceDescriptors) {
                      return null
                    }

                    const distance = faceapi.euclideanDistance(
                      faceDescriptors[0],
                      faceDescriptors[1]
                    )
                    return (
                      <FaceSimilarity
                        text={`${faceapi.round(distance)}`}
                        isMatch={distance < 0.6}
                      />
                    )
                  }
                }
                </ComputeFaceDescriptors>
            }
          </LoadModels>
        </MarginTop>
      </Root>
    )
  }
}