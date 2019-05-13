import * as Mui from '@material-ui/core';
import * as MuiIcons from '@material-ui/icons';
import * as React from 'react';

import { SelectableInputElement, SelectableInputElementBaseProps } from './SelectableInputElement';
import { SideBySide } from './styled/SideBySide';
import { VideoWithOverlay, VideoWithOverlayRefs } from './VideoWithOverlay';

const PLAYBACK_RATES = [1.0, 0.75, 0.5, 0.25]

export type SelectableVideoState = {
  isPlaying: boolean
  playbackRate: number
}

export class SelectableVideo extends React.Component<SelectableInputElementBaseProps, SelectableVideoState> {
  videoRef: HTMLVideoElement

  state: SelectableVideoState = {
    isPlaying: false,
    playbackRate: PLAYBACK_RATES[0]
  }

  onPause = () => {
    if (!this.videoRef) {
      return
    }
    this.videoRef.pause()
    this.setState({ isPlaying: false })
  }

  onPlay = () => {
    if (!this.videoRef) {
      return
    }
    this.videoRef.play()
    this.setState({ isPlaying: true })
  }

  onChangePlaybackRate = (e: any) => {
    if (!this.videoRef) {
      return
    }
    const playbackRate = e.target.value
    this.videoRef.playbackRate = playbackRate
    this.setState({ playbackRate })
  }

  onTimeUpdate = (e: any) => {
    if (this.videoRef !== e.target) {
      return
    }
    //const { currentTime, duration } = this.videoRef
  }

  onLoaded = (refs: VideoWithOverlayRefs) => {
    this.videoRef = refs.mediaElement.element
    this.props.onLoaded(refs)
    this.setState({ isPlaying: true })
    this.videoRef.ontimeupdate = this.onTimeUpdate
  }

  render() {
    return (
      <div>
        <SelectableInputElement
          {...this.props}
          accept="video/*"
          renderMediaElement={props =>
            <VideoWithOverlay
              src={props.src}
              onLoaded={this.onLoaded}
              videoStyle={props.mediaElementStyle}
            />
          }
          renderAdditionalControls={() =>
            <SideBySide>
              <Mui.FormControl>
                <Mui.Select
                  value={this.state.playbackRate}
                  onChange={this.onChangePlaybackRate}
                  input={<Mui.Input />}
                >
                  {
                    PLAYBACK_RATES.map(rate =>
                      <Mui.MenuItem
                        key={rate}
                        value={rate}
                      >
                        { rate }
                      </Mui.MenuItem>
                    )
                  }
                </Mui.Select>
                <Mui.FormHelperText>Playback Rate</Mui.FormHelperText>
              </Mui.FormControl>
              {
                this.state.isPlaying
                  ?
                  <Mui.IconButton
                    onClick={this.onPause}
                  >
                    <MuiIcons.Pause />
                  </Mui.IconButton>
                  :
                  <Mui.IconButton
                    onClick={this.onPlay}
                  >
                    <MuiIcons.PlayArrow />
                  </Mui.IconButton>
              }
            </SideBySide>
          }
        />

      </div>
    )
  }
}