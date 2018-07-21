import * as faceapi from 'face-api.js';
import * as React from 'react';

import { FaceSimilarity } from '../components/FaceSimilarity';
import { SelectableImage } from '../components/SelectableImage';
import { SideBySide } from '../components/SideBySide';
import { ALIGNED_FACE_IMAGES } from '../const';
import { ComputeFaceDescriptors } from '../facc/ComputeFaceDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceSimilarityPageProps = {
  faceRecognitionNet?: faceapi.FaceRecognitionNet
}

type FaceSimilarityPageState = {
  inputImg1: ImageWrap
  inputImg2: ImageWrap
}

export default class extends React.Component<FaceSimilarityPageProps, FaceSimilarityPageState> {

  state: FaceSimilarityPageState = {
    inputImg1: new ImageWrap(ALIGNED_FACE_IMAGES[0].url),
    inputImg2: new ImageWrap(ALIGNED_FACE_IMAGES[1].url)
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
            initialImageSrc={this.state.inputImg1.imageSrc}
            onLoaded={({ img: inputImg1 }) => this.setState({ inputImg1 })}
            maxImageWidth={150}
          />
          <SelectableImage
            items={ALIGNED_FACE_IMAGES}
            initialImageSrc={this.state.inputImg2.imageSrc}
            onLoaded={({ img: inputImg2 }) => this.setState({ inputImg2 })}
            maxImageWidth={150}
          />
        </SideBySide>
        <LoadModels faceRecognitionModelUrl="models">
          {
            ({ faceRecognitionNet }) =>
              <ComputeFaceDescriptors
                imgs={[this.state.inputImg1, this.state.inputImg2]}
                faceRecognitionNet={faceRecognitionNet}
              >
              {
                (faceDescriptors) => {
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
      </Root>
    )
  }
}