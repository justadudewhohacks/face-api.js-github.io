import { MediaElement } from 'face-api.js-react';
import * as React from 'react';

export type VideoWithOverlayProps = {
  onLoaded?: (refs: { video: MediaElement, overlay: HTMLCanvasElement }) => any
  onVideoRef?: () => any
  maxVideoWidth?: number
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
      this.props.onLoaded({ video: new MediaElement(video), overlay })
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
          style={{ width: '100%', maxWidth: this.props.maxVideoWidth }}
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