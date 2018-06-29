import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWithOverlay } from './ImageWithOverlay';

type FaceDetectionProps = {
  minDetectionScore: number
  imageSrc: string
  faceDetectionNet?: faceapi.FaceDetectionNet
  maxImageWidth?: number
}

export class FaceDetection extends React.Component<FaceDetectionProps> {

  static defaultProps = {
    maxImageWidth: 800
  }

  overlay: HTMLCanvasElement | undefined
  inputImg: HTMLImageElement | undefined

  async detectAndDrawFaceLocations() {
    const locations = await this.props.faceDetectionNet.locateFaces(this.inputImg, this.props.minDetectionScore)

    const { width, height } = this.inputImg
    this.overlay.width = width
    this.overlay.height = height
    this.overlay.getContext('2d').clearRect(0, 0, width, height)
    faceapi.drawDetection(this.overlay, locations.map(loc => loc.forSize(width, height)))
  }

  componentDidUpdate(prevProps: FaceDetectionProps) {
    if (!this.props.faceDetectionNet) {
      return
    }

    if (
      prevProps.faceDetectionNet !== this.props.faceDetectionNet
      || prevProps.imageSrc !== this.props.imageSrc
    ) {
      this.detectAndDrawFaceLocations()
    }
  }

  public render() {
    return(
      <ImageWithOverlay
        imageSrc={this.props.imageSrc}
        onImageRef={el => this.inputImg = el}
        onCanvasRef={el => this.overlay = el}
        maxImageWidth={this.props.maxImageWidth}
      />
    )
  }
}