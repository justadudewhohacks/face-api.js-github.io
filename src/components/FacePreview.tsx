import * as Mui from '@material-ui/core';
import * as faceapi from 'face-api.js';
import * as React from 'react';
import styled from 'styled-components';
import * as MuiIcons from '@material-ui/icons';


const NameInput = Mui.withStyles({ className: { width: 120, textAlign: 'center' } })(
  (props: { classes: any, value: string, onChange: (value: React.ChangeEvent<HTMLInputElement>) => any }) =>
    <Mui.Input
      value={props.value}
      onChange={props.onChange}
      className={props.classes.className}
      placeholder="Give me a name!"
    />
)

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const FaceContainer = styled.div`
  position: relative;
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

const RemoveIcon = styled(MuiIcons.DeleteOutlined)`
  position: absolute;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  color: rgb(255, 50, 50);
  width: 100% !important;
  height: 100% !important;
  cursor: pointer;
`

export type FacePreviewProps = {
  face: HTMLCanvasElement
  name: string
  onNameChanged: (name: string) => any
  onRemove: (_: any) => any
}

export type FacePreviewState = {
  isHovered: boolean
}

export class FacePreview extends React.Component<FacePreviewProps, FacePreviewState> {
  state = {
    isHovered: false
  }

  ref: HTMLCanvasElement

  onRef = (ref: HTMLCanvasElement) => {
    this.ref = ref
    this.updateCanvas()
  }

  updateCanvas = () => {
    if (this.ref && this.props.face) {
      faceapi.matchDimensions(this.ref, this.props.face)
      faceapi.getContext2dOrThrow(this.ref).drawImage(this.props.face, 0, 0)
    }
  }

  componentDidUpdate() {
    this.updateCanvas()
  }

  componentDidMount() {
    this.updateCanvas()
  }

  onMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  onMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  render() {
    return (
      <Container>
        <FaceContainer
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <Canvas ref={this.onRef} />
          { this.state.isHovered ? <RemoveIcon onClick={this.props.onRemove} /> : null }
        </FaceContainer>
        <NameInput
          value={this.props.name}
          onChange={e => this.props.onNameChanged(e.target.value)}
        />
      </Container>
    )
  }
}