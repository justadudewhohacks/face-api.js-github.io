import * as Mui from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';

import { ReactElement } from '../types';
import { FileSelectionControls, FileSelectionControlsItem } from './FileSelectionControls';
import { ImageWithOverlayRefs } from './ImageWithOverlay';
import { SideBySide } from './styled/SideBySide';
import { VideoWithOverlayRefs } from './VideoWithOverlay';

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MediaElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  width: 800px;
`

const Margin = styled.div`
  margin: 10px;
`

export enum SelectionTypes {
  SELECT = 'SELECT',
  FILE = 'FILE',
  BOTH = 'BOTH'
}

export type OnRefsLoadedCallback = (refs: ImageWithOverlayRefs | VideoWithOverlayRefs) => any

export type SelectableInputElementBaseProps = {
  onLoaded: OnRefsLoadedCallback
  mediaElementId: string
  items?: FileSelectionControlsItem[]
  initialSrc?: string
  selectionType?: SelectionTypes
  mediaElementStyle?: React.CSSProperties
  getFps?: () => number
}

export type SelectableInputElementProps = SelectableInputElementBaseProps & {
  accept: string
  renderMediaElement: (props: {
    src: string,
    onLoaded: OnRefsLoadedCallback,
    mediaElementStyle?: React.CSSProperties
  }) => ReactElement
  renderAdditionalControls?: () => ReactElement
}

export type SelectableInputElementState = {
  src: string
}

export class SelectableInputElement extends React.Component<SelectableInputElementProps, SelectableInputElementState> {
  static defaultProps: Partial<SelectableInputElementProps> = {
    selectionType: SelectionTypes.SELECT
  }

  constructor(props: SelectableInputElementProps) {
    super(props)

    this.state = {
      src: props.initialSrc
    }

    this.onChangeSelection = this.onChangeSelection.bind(this)
    this.onLoadFromDisk = this.onLoadFromDisk.bind(this)
  }

  onChangeSelection(src: string) {
    this.setState({
      src
    })
  }

  onLoadFromDisk(e: any) {
    const file = (e.target.files || [])[0]
    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = (loadEvent: any) =>
      this.setState({
        src: loadEvent.target.result
      })

    reader.readAsDataURL(file)
  }

  render() {
    const { selectionType, onLoaded, mediaElementStyle, renderMediaElement, renderAdditionalControls } = this.props
    const { src } = this.state
    return (
      <Container>
        <MediaElement>
          { renderMediaElement({ src, onLoaded, mediaElementStyle }) }
        </MediaElement>
        <SideBySide>
        {
          (selectionType === SelectionTypes.SELECT || selectionType === SelectionTypes.BOTH)
            &&
            <Margin>
              <FileSelectionControls
                items={this.props.items}
                selectedFile={this.state.src}
                onChange={this.onChangeSelection}
              />
            </Margin>
        }
        {
          (selectionType === SelectionTypes.FILE || selectionType === SelectionTypes.BOTH)
            &&
            <Margin>
              <input
                accept={this.props.accept}
                id={this.props.mediaElementId}
                multiple
                style={{ display: 'none' }}
                onChange={this.onLoadFromDisk}
                type="file"
              />
              <label htmlFor={this.props.mediaElementId}>
                <Mui.Button variant="outlined" component="span">
                  From Disk
                </Mui.Button>
              </label>
            </Margin>
        }
        { renderAdditionalControls ? renderAdditionalControls() : null }
        </SideBySide>
      </Container>
    )
  }
}