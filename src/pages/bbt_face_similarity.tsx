import * as faceapi from 'face-api.js';
import { ComputeFaceDescriptors, LoadModels, MediaElement } from 'face-api.js-react';
import * as React from 'react';

import { FaceSimilarity } from '../components/FaceSimilarity';
import { ModalLoader } from '../components/ModalLoader';
import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES, MODELS_URI } from '../const';
import { Root } from '../Root';
import { MarginTop } from '../styled/MarginTop';
import { SideBySide } from '../styled/SideBySide';

type PageState = {
  inputImg1?: MediaElement
  inputImg2?: MediaElement
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
        <SideBySide>
          <SelectableImage
            items={ALIGNED_FACE_IMAGES}
            initialImageSrc={ALIGNED_FACE_IMAGES[30].url}
            onLoaded={({ img: inputImg1 }) => this.setState({ inputImg1 })}
            imageStyle={{ maxWidth: 150 }}
            imgId="img1"
          />
          <SelectableImage
            items={ALIGNED_FACE_IMAGES}
            initialImageSrc={ALIGNED_FACE_IMAGES[31].url}
            onLoaded={({ img: inputImg2 }) => this.setState({ inputImg2 })}
            imageStyle={{ maxWidth: 150 }}
            imgId="img2"
          />
        </SideBySide>
        <MarginTop>
          <LoadModels
            faceRecognitionModelUrl={MODELS_URI}
            renderBusyComponent={
              () => <ModalLoader title="Loading Face Recognition Model" />
            }
          >
          {() =>
            <ComputeFaceDescriptors
              inputs={[this.state.inputImg1, this.state.inputImg2]}
              renderBusyComponent={
                () => <ModalLoader title="Computing Face Descriptors" />
              }
            >
            {({ faceDescriptors }) => {
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
            }}
            </ComputeFaceDescriptors>
          }
          </LoadModels>
        </MarginTop>
      </Root>
    )
  }
}