import { Checkbox, FormControlLabel } from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';

import { SelectableImage } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES } from '../const';
import { DetectFaceLandmarks } from '../facc/DetectFaceLandmarks';
import { LoadModels } from '../facc/LoadModels';
import { ImageWrap } from '../ImageWrap';
import { Root } from '../Root';
import { MarginTop } from '../styled/MarginTop';


type FaceLandmarksPageProps = {
  faceLandmarkNet?: faceapi.FaceLandmarkNet
}

type FaceLandmarksPageState = {
  inputImg: ImageWrap
  drawLines: boolean
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<FaceLandmarksPageProps, FaceLandmarksPageState> {

  state: FaceLandmarksPageState = {
    inputImg: new ImageWrap(ALIGNED_FACE_IMAGES[30].url),
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
          initialImageSrc={this.state.inputImg.imageSrc}
          onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
          maxImageWidth={150}
        />
        <MarginTop>
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
        </MarginTop>
        <LoadModels faceLandmarkModelUrl="models">
        {
          ({ faceLandmarkNet }) =>
            <DetectFaceLandmarks
              imgs={[this.state.inputImg]}
              faceLandmarkNet={faceLandmarkNet}
            >
            {
              (faceLandmarks) => {
                const { overlay, drawLines } = this.state

                if (overlay && faceLandmarks) {
                  const { width, height } = overlay
                  overlay.getContext('2d').clearRect(0, 0, width, height)
                  faceapi.drawLandmarks(
                    overlay,
                    faceLandmarks.map(l => l.forSize(width, height)),
                    { drawLines }
                  )
                }

                return null
              }
            }
            </DetectFaceLandmarks>
        }
        </LoadModels>
      </Root>
    )
  }
}