import { Checkbox, FormControlLabel } from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES } from '../const';
import { withFaceLandmarks } from '../hocs/withFaceLandmarks';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';

type FaceLandmarksPageProps = {
}

type FaceLandmarksPageState = {
  inputImg: ImageWrap
  drawLines: boolean
  faceLandmarkNet?: faceapi.FaceLandmarkNet
  overlay?: HTMLCanvasElement
}

interface FaceLandmarksProps {
  drawLines: boolean
  overlay?: HTMLCanvasElement
}

const FaceLandmarks = withFaceLandmarks<FaceLandmarksProps>((props) => {
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
})

export default class extends React.Component<FaceLandmarksPageProps, FaceLandmarksPageState> {

  state: FaceLandmarksPageState = {
    inputImg: new ImageWrap(ALIGNED_FACE_IMAGES[0].url),
    drawLines: true
  }

  async loadModels() {
    const faceLandmarkNet = new faceapi.FaceLandmarkNet()
    await faceLandmarkNet.load('models')
    this.setState({ faceLandmarkNet })
  }

  componentWillMount() {
    if (typeof window != 'undefined' && window.document) {
      this.loadModels()
    }
  }

  toggleDrawLines = () => {
    this.setState(state => ({ drawLines: !state.drawLines }))
  }

  public render() {
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
          imgs={[this.state.inputImg]}
          faceLandmarkNet={this.state.faceLandmarkNet}
          drawLines={this.state.drawLines}
          overlay={this.state.overlay}
        />
      </Root>
    )
  }
}