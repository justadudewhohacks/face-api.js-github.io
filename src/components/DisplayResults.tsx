import * as faceapi from 'face-api.js';
import * as React from 'react';

import { shallowEquals } from '../commons/shallowEquals';
import { BestMatch } from '../facc/ComputeRefDescriptors';

export type DisplayResult = {
  faceDetection: faceapi.FaceDetection,
  faceLandmarks: faceapi.FaceLandmarks
}

export type DisplayResultsProps = {
  overlay: HTMLCanvasElement
  faceDetections?: faceapi.FaceDetection[] 
  faceLandmarks?: faceapi.FaceLandmarks[]
  bestMatches?: BestMatch[]
  withScore?: boolean
  drawLines?: boolean
  onRendered?: () => any
}

export class DisplayResults extends React.Component<DisplayResultsProps> {

  static defaultProps: Partial<DisplayResultsProps> = {
    withScore: true,
    drawLines: true
  }

  draw() {
    const { overlay, faceDetections, faceLandmarks, bestMatches, withScore, drawLines } = this.props

    overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height)

    if (faceDetections && faceDetections.length) {
      faceapi.drawDetection(
        overlay,
        faceDetections.map(det => det.forSize(overlay.width, overlay.height)),
        { withScore }
      )
    }

    if (faceLandmarks && faceLandmarks.length) {
      faceapi.drawLandmarks(
        overlay,
        faceLandmarks.map((landmarks, i) => {
          if (faceDetections && landmarks instanceof faceapi.FaceLandmarks68) {
            const { x, y, width, height } = faceDetections[i].box
            return landmarks.forSize(width, height).shift(x, y)
          }
          return landmarks.forSize(overlay.width, overlay.height)
        }),
        { drawLines, color: 'red', lineWidth: drawLines ? 2 : 2 }
      )
    }

    if (bestMatches) {
      bestMatches.forEach((bestMatch, i) => {
        const text = `${bestMatch.distance < 0.6 ? bestMatch.label : 'unknown'} (${faceapi.round(bestMatch.distance)})`
        const { x, y, height: boxHeight } = faceDetections[i].forSize(overlay.width, overlay.height).getBox()
        faceapi.drawText(
          overlay.getContext('2d'),
          x,
          y + boxHeight,
          text,
          Object.assign(faceapi.getDefaultDrawOptions(), { color: 'red', fontSize: 16 })
        )
      })
    }
  }

  componentWillReceiveProps(nextProps: DisplayResultsProps) {
    if (!shallowEquals(this.props, nextProps, ['children'])) {
      this.draw()
    }
  }

  componentDidMount() {
    this.draw()
  }

  render(): any {
    this.props.onRendered && this.props.onRendered()
    return null
  }
}