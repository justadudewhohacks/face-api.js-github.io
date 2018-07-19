import { FormControl, Input, InputLabel } from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { SideBySide } from '../components/SideBySide';
import { ALIGNED_FACE_IMAGES } from '../const';
import { withFaceDescriptors, WithFaceDescriptorsInjectedProps } from '../hocs/withFaceDescriptors';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceSimilarityPageProps = {
}

type FaceSimilarityPageState = {
  inputImg1: ImageWrap
  inputImg2: ImageWrap
  faceRecognitionNet: faceapi.FaceRecognitionNet | undefined
}

const FaceSimilarity = withFaceDescriptors<{}>((props: WithFaceDescriptorsInjectedProps) =>
  <FormControl>
    <InputLabel htmlFor="distance">
      Distance:
    </InputLabel>
    <Input
      id="distance"
      value={
        props.faceDescriptors
          ? faceapi.euclideanDistance(props.faceDescriptors[0], props.faceDescriptors[1])
          : '-'
      }
    />
  </FormControl>
)

export default class extends React.Component<FaceSimilarityPageProps, FaceSimilarityPageState> {

  state: FaceSimilarityPageState = {
    inputImg1: new ImageWrap(ALIGNED_FACE_IMAGES[0].url),
    inputImg2: new ImageWrap(ALIGNED_FACE_IMAGES[1].url),
    faceRecognitionNet: undefined
  }

  async loadModels() {
    const faceRecognitionNet = new faceapi.FaceRecognitionNet()
    await faceRecognitionNet.load('models')
    this.setState({ faceRecognitionNet })
  }

  componentWillMount() {
    if (typeof window != 'undefined' && window.document) {
      this.loadModels()
    }
  }

  public render() {
    return(
      <Root>
        <SideBySide>
          <SelectableImage
            items={ALIGNED_FACE_IMAGES}
            imageSrc={this.state.inputImg1.imageSrc}
            onChangeSelection={src => this.setState({ inputImg1: this.state.inputImg1.withImageSrc(src) })}
            onRefs={({ img }) => this.setState({ inputImg1: this.state.inputImg1.withImage(img) })}
            maxImageWidth={150}
          />
          <SelectableImage
            items={ALIGNED_FACE_IMAGES}
            imageSrc={this.state.inputImg2.imageSrc}
            onChangeSelection={src => this.setState({ inputImg2: this.state.inputImg2.withImageSrc(src) })}
            onRefs={({ img }) => this.setState({ inputImg2: this.state.inputImg2.withImage(img) })}
            maxImageWidth={150}
          />
        </SideBySide>
        <FaceSimilarity
          imgs={[this.state.inputImg1, this.state.inputImg2]}
          faceRecognitionNet={this.state.faceRecognitionNet}
        />
      </Root>
    )
  }
}
