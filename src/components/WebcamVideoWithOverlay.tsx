import * as faceapi from 'face-api.js';
import * as React from 'react';

import { VideoWrap } from '../VideoWrap';

export type WebcamVideoWithOverlayProps = {
  onLoaded: (refs: { video: VideoWrap, overlay: HTMLCanvasElement}) => any
  maxVideoWidth?: number
}

export class WebcamVideoWithOverlay extends React.Component<WebcamVideoWithOverlayProps> {
  video: HTMLVideoElement | undefined
  overlay: HTMLCanvasElement | undefined
  isLoaded: boolean = false

  constructor(props: WebcamVideoWithOverlayProps) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.onVideoRef = this.onVideoRef.bind(this)
    this.onCanvasRef = this.onCanvasRef.bind(this)
    this.onPlay = this.onPlay.bind(this)
  }

  onChange() {
    const { video, overlay, isLoaded } = this

    if (video && overlay && isLoaded) {
      const { width, height } = faceapi.getMediaDimensions(this.video)
      this.overlay.width = width,
      this.overlay.height = height
      this.props.onLoaded({ video: new VideoWrap(video), overlay })
    }
  }

  onVideoRef(el: HTMLVideoElement) {
    this.video = el
    this.onChange()
    navigator.getUserMedia(
      { video: {} },
      stream => {
        this.video.srcObject = stream
      },
      err => console.error(err)
    )
  }

  onCanvasRef(el: HTMLCanvasElement) {
    this.overlay = el
    this.onChange()
  }

  onPlay() {
    this.isLoaded = true
    this.onChange()
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidUpdate() {
    this.onChange()
  }

  componentDidMount() {
    this.onChange()
  }

  public render() {
    return(
      <div style={{ position: 'relative' }}>
        <video
          muted
          autoPlay
          style={{ maxWidth: this.props.maxVideoWidth }}
          ref={this.onVideoRef}
          onPlay={this.onPlay}
        />
        <canvas
          style={{ position: 'absolute', top: 0, left: 0 }}
          ref={this.onCanvasRef}
        />
      </div>
    )
  }
}