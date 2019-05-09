import * as React from 'react';

import { MediaElement } from '../MediaElement';

export type ImageWithOverlayRefs = {
  mediaElement: MediaElement<HTMLImageElement>,
  overlay: HTMLCanvasElement
}

export type ImageWithOverlayProps = {
  imageSrc: string
  onLoaded: (refs: ImageWithOverlayRefs) => any
  containerStyle?: React.CSSProperties
  imageStyle?: React.CSSProperties
  canvasStyle?: React.CSSProperties
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
      this.props.onLoaded({ mediaElement: new MediaElement(img), overlay })
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
      <div style={Object.assign({}, { position: 'relative' }, this.props.containerStyle)}>
        <img
          src={this.props.imageSrc}
          ref={this.onImageRef}
          style={Object.assign({}, this.props.imageStyle)}
          onLoad={this.onImageLoaded}
        />
        <canvas
          style={Object.assign({}, { position: 'absolute', top: 0, left: 0 }, this.props.canvasStyle)}
          ref={this.onCanvasRef}
        />
      </div>
    )
  }
}