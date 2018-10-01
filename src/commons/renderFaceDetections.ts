import * as faceapi from 'face-api.js';

export function renderFaceDetections(faceDetections: any[], overlay: HTMLCanvasElement | null) {
  if (overlay && faceDetections) {
    const { width, height } = overlay
    overlay.getContext('2d').clearRect(0, 0, width, height)

    faceDetections.forEach(faceDetection => {
      if (faceDetection instanceof faceapi.FaceDetection) {
        faceapi.drawDetection(
          overlay,
          faceDetections.map(det => det.forSize(width, height))
        )
      } else {
        faceapi.drawDetection(
          overlay,
          faceDetections.map(res => res.faceDetection.forSize(width, height))
        )
        faceapi.drawLandmarks(
          overlay,
          faceDetections.map(res => res.faceLandmarks.forSize(width, height))
        )
      }
    })
  }
}