import * as faceapi from 'face-api.js';
import * as React from 'react';

import { ImageWithOverlay } from './ImageWithOverlay';

type FaceLandmarksProps = {
  imageSrc: string
  faceLandmarkNet?: faceapi.FaceLandmarkNet
  maxImageWidth?: number
  drawLines?: boolean
}

export class FaceLandmarks extends React.Component<FaceLandmarksProps> {

  overlay: HTMLCanvasElement | undefined
  inputImg: HTMLImageElement | undefined
  landmarks: faceapi.FaceLandmarks

  drawLandmarks() {
    if (!this.landmarks) {
      return
    }

    const { width, height } = this.inputImg
    this.overlay.width = width
    this.overlay.height = height
    this.overlay.getContext('2d').clearRect(0, 0, width, height)

    const drawOpts = {
      lineWidth: this.props.drawLines ? 2 : 4,
      drawLines: this.props.drawLines
    }
    faceapi.drawLandmarks(this.overlay, this.landmarks, drawOpts)

  }

  async detectAndDrawLandmarks() {
    this.landmarks = await this.props.faceLandmarkNet.detectLandmarks(this.inputImg)
    this.drawLandmarks()
  }

  componentDidUpdate(prevProps: FaceLandmarksProps) {
    if (!this.props.faceLandmarkNet) {
      return
    }

    if (
      prevProps.faceLandmarkNet !== this.props.faceLandmarkNet
      || prevProps.imageSrc !== this.props.imageSrc
    ) {
      this.detectAndDrawLandmarks()
    } else if (
      prevProps.drawLines !== this.props.drawLines
    ) {
      this.drawLandmarks()
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