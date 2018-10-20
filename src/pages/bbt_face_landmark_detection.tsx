import * as Mui from '@material-ui/core';
import { LoadModels, MediaElement } from 'face-api.js-react';
import { DisplayResults } from 'face-api.js-react/components/DisplayResults';
import * as React from 'react';

import { DetectFaceLandmarks } from '../../face-api.js-react/facc/DetectFaceLandmarks';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { ALIGNED_FACE_IMAGES, MODELS_URI } from '../const';
import { Root } from '../Root';
import { MarginTop } from '../styled/MarginTop';

type PageState = {
  drawLines: boolean
  inputImg?: MediaElement
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, PageState> {

  state: PageState = {
    drawLines: true
  }

  toggleDrawLines = () => {
    this.setState({ drawLines: !this.state.drawLines })
  }

  onTabIndexChanged = () => {
    this.setState({ inputImg: undefined })
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document) ){
      return null
    }

    return(
      <Root>
        <LoadModels
          faceLandmarkModelUrl={MODELS_URI}
        >
        {() =>
          <div>
            <SelectableImage
              items={ALIGNED_FACE_IMAGES}
              initialImageSrc={ALIGNED_FACE_IMAGES[30].url}
              onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
              selectionType={SelectionTypes.SELECT}
              imageStyle={{ maxWidth: 150 }}
              imgId="img"
            />
            <DetectFaceLandmarks input={this.state.inputImg}>
            {({ faceLandmarks }) =>
              <DisplayResults
                input={this.state.inputImg}
                results={[faceLandmarks]}
                overlay={this.state.overlay}
                displayResultsOptions={{ drawLines: this.state.drawLines }}
              />
            }
            </DetectFaceLandmarks>
          </div>
        }
        </LoadModels>

        <MarginTop>
          <Mui.FormControlLabel
            control={
              <Mui.Checkbox
                checked={this.state.drawLines}
                onChange={this.toggleDrawLines}
                color="primary"
              />
            }
            label="Draw Lines"
          />
        </MarginTop>

      </Root>
    )
  }
}