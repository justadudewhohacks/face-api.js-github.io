import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageSelection } from '../components/ImageSelection';
import { Root } from '../Root';
import { FaceLandmarks } from '../components/FaceLandmarks';
import { FormControlLabel, Checkbox } from '@material-ui/core';

type FaceLandmarksPageProps = {
}

type FaceLandmarksPageState = {
  selectedImage: string
  drawLines: boolean
  faceLandmarkNet?: faceapi.FaceLandmarkNet
}

const SELECTABLE_ITEMS = ['amy', 'bernadette', 'howard', 'leonard', 'penny', 'raj', 'sheldon', 'stuart']
  .map(
    clazz => [1, 2, 3, 4, 5]
      .map(idx => `${clazz}${idx}.png`)
      .map(label => ({
        label,
        url: `images/${clazz}/${label}`
      }))
  )
  .reduce((flat, arr) => flat.concat(arr), [])

export default class extends React.Component<FaceLandmarksPageProps, FaceLandmarksPageState> {

  state: FaceLandmarksPageState = {
    selectedImage: SELECTABLE_ITEMS[0].url,
    drawLines: false
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
        <FaceLandmarks
          faceLandmarkNet={this.state.faceLandmarkNet}
          imageSrc={this.state.selectedImage}
          maxImageWidth={800}
          drawLines={this.state.drawLines}
        />
        <ImageSelection
          items={SELECTABLE_ITEMS}
          selectedImage={this.state.selectedImage}
          onChange={selectedImage => this.setState({ selectedImage })}
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
      </Root>
    )
  }
}