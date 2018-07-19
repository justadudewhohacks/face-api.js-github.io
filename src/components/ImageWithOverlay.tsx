import { withPrefix } from 'gatsby-link';
import * as React from 'react';

export type ImageWithOverlayProps = {
  imageSrc: string
  onRefs: (refs: { img: HTMLImageElement, overlay: HTMLCanvasElement}) => any
  maxImageWidth?: number
}

export class ImageWithOverlay extends React.Component<ImageWithOverlayProps> {
  img: HTMLImageElement | undefined
  overlay: HTMLCanvasElement | undefined

  constructor(props: ImageWithOverlayProps) {
    super(props)

    this.onImageLoaded = this.onImageLoaded.bind(this)
    this.onImageRef = this.onImageRef.bind(this)
    this.onCanvasRef = this.onCanvasRef.bind(this)
  }

  onRef() {
    const { img, overlay } = this

    if (img && overlay) {
      this.props.onRefs({ img, overlay })
    }
  }

  onImageLoaded() {
    this.overlay.height = this.img.height
    this.overlay.width = this.img.width
  }

  onImageRef(el: HTMLImageElement) {
    this.img = el
    this.onRef()
  }

  onCanvasRef(el: HTMLCanvasElement) {
    this.overlay = el
    this.onRef()
  }

  shouldComponentUpdate(nextProps: ImageWithOverlayProps) {
    return nextProps.imageSrc !== this.props.imageSrc
  }

  public render() {
    return(
      <div style={{ position: 'relative' }}>
        <img
          src={withPrefix(this.props.imageSrc)}
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