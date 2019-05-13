import * as React from 'react';

import { VideoWithOverlay, VideoWithOverlayRefs } from './VideoWithOverlay';

export type WebcamVideoWithOverlayProps = {
  onLoaded: (refs: VideoWithOverlayRefs) => any
  maxVideoWidth?: number
}

type WebcamVideoWithOverlayState = {
  srcObject?: MediaStream | MediaSource | Blob | null
  error?: string
}

export class WebcamVideoWithOverlay extends React.Component<WebcamVideoWithOverlayProps, WebcamVideoWithOverlayState> {
  state: WebcamVideoWithOverlayState = {
  }

  onVideoRef = async () => {
    try {
      const srcObject = await navigator.mediaDevices.getUserMedia({ video: {} })
      this.setState({ srcObject })
    } catch (err) {
      this.setState({ error: err.toString() })
    }
  }

  public render() {
    if (this.state.error) {
      return (
        <div style={{ background: 'red', color: 'white' }}>
          <h3> Error occured while requesting webcam access: </h3>
          <p> { this.state.error } </p>
        </div>
      )
    }

    return(
      <VideoWithOverlay
        srcObject={this.state.srcObject}
        onLoaded={this.props.onLoaded}
        videoStyle={{ maxWidth: this.props.maxVideoWidth }}
        onVideoRef={this.onVideoRef}
      />
    )
  }
}