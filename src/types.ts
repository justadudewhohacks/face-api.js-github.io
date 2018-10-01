export type TinyYolov2DetectionParams = {
  inputSize: number
  scoreThreshold: number
}

export type MtcnnDetectionParams = {
  minFaceSize: number
  scaleFactor: number
}

export type SsdMobilenetv1DetectionParams = {
  minConfidence: number
}
