import * as React from 'react';

import { MediaElement } from '../MediaElement';

export type VideoWithOverlayRefs = {
  mediaElement: MediaElement<HTMLVideoElement>,
  overlay: HTMLCanvasElement
}

export type VideoWithOverlayProps = {
  onLoaded?: (refs: VideoWithOverlayRefs) => any
  onVideoRef?: () => any
  videoStyle?: React.CSSProperties
  src?: string
  srcObject?: MediaStream | MediaSource | Blob | null
}

export class VideoWithOverlay extends React.Component<VideoWithOverlayProps> {
  video: HTMLVideoElement | undefined
  overlay: HTMLCanvasElement | undefined
  isLoaded: boolean = false

  constructor(props: VideoWithOverlayProps) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.onVideoRef = this.onVideoRef.bind(this)
    this.onCanvasRef = this.onCanvasRef.bind(this)
    this.onPlay = this.onPlay.bind(this)
  }

  onChange() {
    const { video, overlay, isLoaded } = this

    if (video && overlay && isLoaded) {
      const { width, height } = this.video.getBoundingClientRect()
      this.overlay.width = width,
      this.overlay.height = height
      this.props.onLoaded({ mediaElement: new MediaElement(video), overlay })
    }
  }

  onVideoRef(el: HTMLVideoElement) {
    this.video = el
    this.props.onVideoRef && this.props.onVideoRef()
    this.onChange()
  }

  onCanvasRef(el: HTMLCanvasElement) {
    this.overlay = el
    this.onChange()
  }

  onPlay() {
    this.isLoaded = true
    this.onChange()
  }

  componentWillReceiveProps(nextProps: VideoWithOverlayProps) {
    const { srcObject } = nextProps
    if (srcObject && this.props.srcObject !== srcObject) {
      this.video.srcObject = srcObject
    }
  }

  shouldComponentUpdate(nextProps: VideoWithOverlayProps) {
    return nextProps.src !== this.props.src
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
          style={Object.assign({}, this.props.videoStyle)}
          ref={this.onVideoRef}
          onPlay={this.onPlay}
          src={this.props.src}
        />
        <canvas
          style={{ position: 'absolute', top: 0, left: 0 }}
          ref={this.onCanvasRef}
        />
      </div>
    )
  }
}