import { MediaElement } from 'face-api.js-react';
import * as React from 'react';

import { VideoWithOverlay } from './VideoWithOverlay';

export type WebcamVideoWithOverlayProps = {
  onLoaded: (refs: { video: MediaElement, overlay: HTMLCanvasElement }) => any
  maxVideoWidth?: number
}

type WebcamVideoWithOverlayState = {
  srcObject?: MediaStream | MediaSource | Blob | null
}

export class WebcamVideoWithOverlay extends React.Component<WebcamVideoWithOverlayProps, WebcamVideoWithOverlayState> {
  state: WebcamVideoWithOverlayState = {
  }

  onVideoRef = async () => {
    const srcObject = await navigator.mediaDevices.getUserMedia({ video: {} })
    this.setState({ srcObject })
  }

  public render() {
    return(
      <VideoWithOverlay srcObject={this.state.srcObject} />
    )
  }
}