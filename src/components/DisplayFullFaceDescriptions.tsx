import * as faceapi from 'face-api.js';

import { BestMatch } from '../facc/ComputeRefDescriptors';


export interface DisplayFullFaceDescriptionsProps {
  fullFaceDescriptions: faceapi.FullFaceDescription[] | null
  overlay: HTMLCanvasElement | null
  getBestMatch: (queryDescriptor: Float32Array) => BestMatch
  withScore?: boolean
  drawLandmarks?: boolean
}

export const DisplayFullFaceDescriptions = (props: DisplayFullFaceDescriptionsProps): any => {
  const { overlay, fullFaceDescriptions } = props
  if (!fullFaceDescriptions || !overlay) {
    return null
  }

  const { width, height } = overlay
  overlay.getContext('2d').clearRect(0, 0, width, height)

  const faceDetections = fullFaceDescriptions.map(fd => fd.detection.forSize(width, height))

  faceapi.drawDetection(overlay, faceDetections, { withScore: props.withScore })

  if (props.drawLandmarks) {
    faceapi.drawLandmarks(
      overlay,
      fullFaceDescriptions.map(fd => fd.landmarks.forSize(width, height)),
      { color: 'red', drawLines: true, lineWidth: 4 }
    )
  }

  fullFaceDescriptions.forEach(({ detection, descriptor }) => {
    const bestMatch = props.getBestMatch(descriptor)
    const text = `${bestMatch.distance < 0.6 ? bestMatch.label : 'unknown'} (${faceapi.round(bestMatch.distance)})`
    const { x, y, height: boxHeight } = detection.forSize(width, height).getBox()
    faceapi.drawText(
      overlay.getContext('2d'),
      x,
      y + boxHeight,
      text,
      Object.assign(faceapi.getDefaultDrawOptions(), { color: 'red', fontSize: 16 })
    )
  })
  return null
}