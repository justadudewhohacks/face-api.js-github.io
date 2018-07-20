import { Checkbox, FormControlLabel } from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES } from '../const';
import { withFaceLandmarks, WithFaceLandmarksProps } from '../hocs/withFaceLandmarks';
import { withModels } from '../hocs/withModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceLandmarksPageProps = {
  faceLandmarkNet?: faceapi.FaceLandmarkNet
}

type FaceLandmarksPageState = {
  inputImg: ImageWrap
  drawLines: boolean
  overlay?: HTMLCanvasElement
}

interface FaceLandmarksProps {
  drawLines: boolean
  overlay?: HTMLCanvasElement
}

const FaceLandmarks = withModels<FaceLandmarksProps & WithFaceLandmarksProps>(
  withFaceLandmarks<FaceLandmarksProps>((props) => {
    if (props.overlay && props.faceLandmarks) {
      const { width, height } = props.overlay
      props.overlay.getContext('2d').clearRect(0, 0, width, height)
      faceapi.drawLandmarks(
        props.overlay,
        props.faceLandmarks.map(l => l.forSize(width, height)),
        { drawLines: props.drawLines }
      )
    }
    return null
  }
))

export default class extends React.Component<FaceLandmarksPageProps, FaceLandmarksPageState> {

  state: FaceLandmarksPageState = {
    inputImg: new ImageWrap(ALIGNED_FACE_IMAGES[0].url),
    drawLines: true
  }

  toggleDrawLines = () => {
    this.setState(state => ({ drawLines: !state.drawLines }))
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <SelectableImage
          items={ALIGNED_FACE_IMAGES}
          imageSrc={this.state.inputImg.imageSrc}
          onChangeSelection={src => this.setState({ inputImg: this.state.inputImg.withImageSrc(src) })}
          onRefs={({ img, overlay }) => this.setState({ inputImg: this.state.inputImg.withImage(img), overlay })}
          maxImageWidth={150}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={this.state.drawLines}
              onChange={this.toggleDrawLines}
              color="primary"
            />
          }
          label="Draw Lines"
        />
        <FaceLandmarks
          faceLandmarkModelUrl="models"
          imgs={[this.state.inputImg]}
          drawLines={this.state.drawLines}
          overlay={this.state.overlay}
        />
      </Root>
    )
  }
}