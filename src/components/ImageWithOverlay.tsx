import { withPrefix } from 'gatsby-link';
import * as React from 'react';

type FaceDetectionImageProps = {
  imageSrc: string
  onImageRef: (el: HTMLImageElement) => any
  onCanvasRef: (el: HTMLCanvasElement) => any
  maxImageWidth?: number
}
export class ImageWithOverlay extends React.Component<FaceDetectionImageProps> {

  static defaultProps = {
    maxWidth: 800
  }

  public render() {
    return(
      <div style={{ position: 'relative' }}>
        <img
          src={withPrefix(this.props.imageSrc)}
          style={{ maxWidth: this.props.maxImageWidth }}
          ref={this.props.onImageRef}
        />
        <canvas
          style={{ position: 'absolute', top: 0, left: 0 }}
          ref={this.props.onCanvasRef}
        />
      </div>
    )
  }
}