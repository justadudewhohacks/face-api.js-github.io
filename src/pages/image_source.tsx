import * as Mui from '@material-ui/core';
import * as React from 'react';

import { FaceDetectorSelection } from '../components/FaceDetectorSelection';
import { SelectableImage, SelectionTypes } from '../components/SelectableImage';
import { EXAMPLE_IMAGES, EXAMPLE_IMAGES_FACE_EXPRESSIONS } from '../const';
import { MediaElement } from '../MediaElement';
import { Root } from '../Root';

export type ToggleButtonProps = {
  label: string
  isActive: boolean
}

const ToggleButton = ({ label, isActive }) =>
  <Mui.FormControlLabel
    control={
      <Mui.Checkbox
        checked={isActive}
        onChange={() => this.setState({ withBoxes: !this.state.withBoxes })}
        color="primary"
      />
    }
    label="Hide Bounding Boxes"
  />

type PageState = {
  inputImg?: MediaElement<HTMLImageElement>
  overlay?: HTMLCanvasElement
}

export default class extends React.Component<{}, PageState> {

  renderToggleMenu = () => {
    return [
      <ToggleButton label="With Face Landmarks" isActive={true} />,
      <ToggleButton label="With Face Expressions" isActive={true} />,
      <ToggleButton label="With Age and Gender" isActive={false} />
    ]
  }

  public render() {
    if (!(typeof window !== 'undefined' && window.document)) {
      return null
    }

    return(
      <Root>
        <Mui.FormControl>
          <FaceDetectorSelection />
          <SelectableImage
            items={[...EXAMPLE_IMAGES, ...EXAMPLE_IMAGES_FACE_EXPRESSIONS]}
            initialImageSrc={EXAMPLE_IMAGES[0].url}
            onLoaded={({ img: inputImg, overlay }) => this.setState({ inputImg, overlay })}
            selectionType={SelectionTypes.BOTH}
            imageStyle={{ maxWidth: 800 }}
            imgId="img"
          />
        </Mui.FormControl>
      </Root>
    )
  }
}