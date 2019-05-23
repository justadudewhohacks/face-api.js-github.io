import * as Mui from '@material-ui/core';
import * as MuiIcons from '@material-ui/icons';
import * as React from 'react';
import styled from 'styled-components';

import { SelectableInputElement, SelectableInputElementBaseProps } from './SelectableInputElement';
import { CenterContent } from './styled/CenterContent';
import { SideBySide } from './styled/SideBySide';
import { VideoWithOverlay, VideoWithOverlayRefs } from './VideoWithOverlay';

const PLAYBACK_RATES = [1.0, 0.75, 0.5, 0.25]

const PlayButtonContainer = styled(CenterContent)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const PlayButton = styled(Mui.IconButton)`
  svg {
    font-size: 46px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    padding: 8px 16px;
  }
  width: 100%;
  height: 100%;
  border-radius: 0;
`

const ProgressBar = styled.div`
  position: absolute;
  bottom: 8px;
  left: 3%;
  width: 94%;
  height: 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  cursor: pointer;
`

const Progress = styled.div`
  height: 100%;
  width: 4%;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  cursor: pointer;
`

const Margin = styled.div`
  margin: 10px;
`

export type SelectableVideoState = {
  isPlaying: boolean
  isShowPlayControls: boolean
  playbackRate: number
}

export class SelectableVideo extends React.Component<SelectableInputElementBaseProps, SelectableVideoState> {
  videoRef: HTMLVideoElement
  progressRef: HTMLElement

  state: SelectableVideoState = {
    isPlaying: false,
    isShowPlayControls: false,
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

  onJumpTo = (e: any) => {
    if (!this.videoRef) {
      return
    }
    const { left, width } = e.target.getBoundingClientRect()
    const x = e.clientX - left
    const ratio = (x / width)
    const { duration } = this.videoRef
    this.videoRef.currentTime = ratio * duration
    // TODO: figure out why detection stops without timeout?
    this.videoRef.pause()
    setTimeout(() => this.videoRef.play(), 500)
  }

  onTimeUpdate = (e: any) => {
    if (this.videoRef !== e.target || !this.progressRef) {
      return
    }
    const { currentTime, duration } = this.videoRef
    const fpsRef = document.getElementById('fps')
    fpsRef && (fpsRef.value = `${Math.round(this.props.getFps())}`)
    this.progressRef.style['margin-left'] = `${96 * (currentTime / duration)}%`
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
            <div style={{ position: 'relative' }}>
              <VideoWithOverlay
                src={props.src}
                onLoaded={this.onLoaded}
                videoStyle={props.mediaElementStyle}
              />
              <PlayButtonContainer
                style={{ opacity: this.state.isShowPlayControls ? 1 : 0 }}
                onMouseEnter={() => this.setState({ isShowPlayControls: true })}
                onMouseLeave={() => this.setState({ isShowPlayControls: false })}
              >
                <PlayButton
                  onClick={this.state.isPlaying ? this.onPause : this.onPlay}
                >
                  { this.state.isPlaying ? <MuiIcons.Pause /> : <MuiIcons.PlayArrow /> }
                </PlayButton>
              </PlayButtonContainer>
              <ProgressBar onClick={this.onJumpTo}>
                <Progress
                  ref={progressRef => this.progressRef = progressRef}
                >
                </Progress>
              </ProgressBar>
            </div>
          }
          renderAdditionalControls={() =>
            <SideBySide>
              <Margin>
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
              </Margin>
              <Margin>
                <Mui.TextField
                  label="FPS"
                  id="fps"
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  variant="outlined"
                />
              </Margin>
            </SideBySide>
          }
        />
      </div>
    )
  }
}