import * as React from 'react';

import { MediaElement } from '../MediaElement';


export type ImageWithOverlayProps = {
  imageSrc: string
  onLoaded: (refs: { img: MediaElement, overlay: HTMLCanvasElement}) => any
  maxImageWidth?: number
}

export class ImageWithOverlay extends React.Component<ImageWithOverlayProps> {
  img: HTMLImageElement | undefined
  overlay: HTMLCanvasElement | undefined
  isLoaded: boolean = false

  constructor(props: ImageWithOverlayProps) {
    super(props)

    this.onImageLoaded = this.onImageLoaded.bind(this)
    this.onImageRef = this.onImageRef.bind(this)
    this.onCanvasRef = this.onCanvasRef.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange() {
    const { img, overlay, isLoaded } = this

    if (img && overlay && isLoaded) {
      this.overlay.height = this.img.height
      this.overlay.width = this.img.width
      this.props.onLoaded({ img: new MediaElement(img), overlay })
    }
  }

  onImageLoaded() {
    this.isLoaded = true
    this.onChange()
  }

  onImageRef(el: HTMLImageElement) {
    this.img = el
    this.onChange()
  }

  onCanvasRef(el: HTMLCanvasElement) {
    this.overlay = el
    this.onChange()
  }

  shouldComponentUpdate(nextProps: ImageWithOverlayProps) {
    return nextProps.imageSrc !== this.props.imageSrc
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
        <img
          src={this.props.imageSrc}
          style={{ maxWidth: this.props.maxImageWidth }}
          ref={this.onImageRef}
          onLoad={this.onImageLoaded}
        />
        <canvas
          style={{ position: 'absolute', top: 0, left: 0 }}
          ref={this.onCanvasRef}
        />
      </div>
    )
  }
}