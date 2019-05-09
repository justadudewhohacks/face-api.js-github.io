import * as faceapi from 'face-api.js';

const TINY_FACE_DETECTOR = 'Tiny Face Detector'
const SSD_MOBILENET_V1 = 'SSD Mobilenet V1'
const MTCNN = 'MTCNN'

export const FACE_DETECTORS = [
  SSD_MOBILENET_V1,
  TINY_FACE_DETECTOR,
  MTCNN
]

export function getFaceDetectorNameFromOptions(options: faceapi.FaceDetectionOptions) {
  if (options instanceof faceapi.SsdMobilenetv1Options) {
    return SSD_MOBILENET_V1
  }
  if (options instanceof faceapi.TinyFaceDetectorOptions) {
    return TINY_FACE_DETECTOR
  }
  if (options instanceof faceapi.MtcnnOptions) {
    return MTCNN
  }
  throw new Error(`getFaceDetectorNameFromOptions - invalid face detector options`)
}

export function createDefaultFaceDetectorOptionsFromName(detectorName: string) {
  if (detectorName === SSD_MOBILENET_V1) {
    return new faceapi.SsdMobilenetv1Options()
  }
  if (detectorName === TINY_FACE_DETECTOR) {
    return new faceapi.TinyFaceDetectorOptions()
  }
  if (detectorName === MTCNN) {
    return new faceapi.MtcnnOptions()
  }
  throw new Error(`getFaceDetectorNameFromOptions - invalid detectorName: ${detectorName}`)
}

export function getFaceDetectionNetFromName(detectorName: string) {
  if (detectorName === SSD_MOBILENET_V1) {
    return faceapi.nets.ssdMobilenetv1
  }
  if (detectorName === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector
  }
  if (detectorName === MTCNN) {
    return faceapi.nets.mtcnn
  }
  throw new Error(`getFaceDetectionNetFromName - invalid detectorName: ${detectorName}`)
}