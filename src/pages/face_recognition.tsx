import * as faceapi from 'face-api.js';
import * as React from 'react';

import { FaceSimilarity } from '../components/FaceSimilarity';
import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES, ALIGNED_FACE_IMAGES_BY_CLASS } from '../const';
import { ComputeFaceDescriptors } from '../facc/ComputeFaceDescriptors';
import { ComputeRefDescriptors } from '../facc/ComputeRefDescriptors';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceRecognitionPageProps = {
}

type FaceRecognitionPageState = {
  inputImg: ImageWrap
}

export default class extends React.Component<FaceRecognitionPageProps, FaceRecognitionPageState> {

  state: FaceRecognitionPageState = {
    inputImg: new ImageWrap(ALIGNED_FACE_IMAGES_BY_CLASS[0][1].url)
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <SelectableImage
          items={ALIGNED_FACE_IMAGES}
          initialImageSrc={this.state.inputImg.imageSrc}
          onLoaded={({ img: inputImg }) => this.setState({ inputImg })}
          maxImageWidth={150}
        />
        <LoadModels faceRecognitionModelUrl="models">
        {
          ({ faceRecognitionNet }) =>
            <ComputeRefDescriptors
              faceRecognitionNet={faceRecognitionNet}
              refDataSources={ALIGNED_FACE_IMAGES_BY_CLASS.map(srcsByClass => srcsByClass[0])}
            >
            {
              getBestMatch =>
                <ComputeFaceDescriptors
                  imgs={[this.state.inputImg]}
                  faceRecognitionNet={faceRecognitionNet}
                >
                {
                  (faceDescriptors) => {
                    if (!faceDescriptors) {
                      return null
                    }

                    const bestMatch = getBestMatch(faceDescriptors[0])
                    return (
                      <FaceSimilarity
                        text={`${bestMatch.label} ${faceapi.round(bestMatch.distance)}`}
                        isMatch={bestMatch.distance < 0.6}
                      />
                    )
                  }
                }
                </ComputeFaceDescriptors>
            }
            </ComputeRefDescriptors>
        }
        </LoadModels>
      </Root>
    )
  }
}