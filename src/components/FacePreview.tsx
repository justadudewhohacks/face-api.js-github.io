import * as faceapi from 'face-api.js';
import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const FaceContainer = styled.div`
  width: 120px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px;
`

const Canvas = styled.canvas`
  max-width: 120px;
  max-height: 100px;
`

export type FacePreviewProps = {
  canvas: HTMLCanvasElement
  label: string
}

export class FacePreview extends React.Component<FacePreviewProps> {
  ref: HTMLCanvasElement

  onRef = (ref: HTMLCanvasElement) => {
    this.ref = ref
    this.updateCanvas()
  }

  updateCanvas = () => {
    if (this.ref && this.props.canvas) {
      faceapi.matchDimensions(this.ref, this.props.canvas)
      faceapi.getContext2dOrThrow(this.ref).drawImage(this.props.canvas, 0, 0)
    }
  }

  componentDidUpdate() {
    this.updateCanvas()
  }

  componentDidMount() {
    this.updateCanvas()
  }

  render() {
    return (
      <Container>
        <FaceContainer>
          <Canvas ref={this.onRef} />
        </FaceContainer>
        <span> { this.props.label } </span>
      </Container>
    )
  }
}