import * as React from 'react';
import styled from 'styled-components';

import { ImageWrap } from '../ImageWrap';
import { ImageSelection, ImageSelectionItem } from './ImageSelection';
import { ImageWithOverlay } from './ImageWithOverlay';

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export type SelectableImageProps = {
  items: ImageSelectionItem[]
  initialImageSrc: string
  onLoaded: (refs: { img: ImageWrap, overlay: HTMLCanvasElement}) => any
  maxImageWidth?: number
}

export type SelectableImageState = {
  imageSrc: string
}

export class SelectableImage extends React.Component<SelectableImageProps, SelectableImageState> {
  constructor(props: SelectableImageProps) {
    super(props)

    this.state = {
      imageSrc: props.initialImageSrc
    }

    this.onChangeSelection = this.onChangeSelection.bind(this)
  }

  onChangeSelection(imageSrc: string) {
    this.setState({
      imageSrc
    })
  }

  render() {
    return (
      <Container>
        <ImageWithOverlay
          {...this.props}
          imageSrc={this.state.imageSrc}
        />
        <ImageSelection
          items={this.props.items}
          selectedImage={this.state.imageSrc}
          onChange={this.onChangeSelection}
        />
      </Container>
    )
  }
}