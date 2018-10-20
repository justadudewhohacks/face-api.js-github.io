import { withPrefix } from 'gatsby-link';

export const EXAMPLE_IMAGES = [1, 2, 3, 4, 5]
  .map(idx => `bbt${idx}.jpg`)
  .map(label => ({
    label,
    url: withPrefix(`/images/${label}`)
  }))

export const ALIGNED_FACE_IMAGES_BY_CLASS = ['amy', 'bernadette', 'howard', 'leonard', 'penny', 'raj', 'sheldon', 'stuart']
  .map(
    clazz => [1, 2, 3, 4, 5]
      .map(idx => `${clazz}${idx}.png`)
      .map(label => ({
        label,
        url: withPrefix(`/images/${clazz}/${label}`)
      }))
  )

export const EXAMPLE_VIDEO = withPrefix(`/media/bbt.mp4`)

export const MODELS_URI = withPrefix(`/models`)

export const ALIGNED_FACE_IMAGES = ALIGNED_FACE_IMAGES_BY_CLASS
  .reduce((flat, arr) => flat.concat(arr), [])

export const FACE_DETECTORS = ['Tiny Face Detector', 'SSD Mobilenet V1', 'MTCNN']

export function isTinyFaceDetector(detectorName: string) {
  return detectorName === FACE_DETECTORS[0]
}

export function isSsdMobilenetv1(detectorName: string) {
  return detectorName === FACE_DETECTORS[1]
}

export function isMtcnn(detectorName: string) {
  return detectorName === FACE_DETECTORS[2]
}

export function getFaceDetectionModelUri(detectorName: string, modelUri: string) {
  if (isTinyFaceDetector(detectorName)) {
    return { tinyFaceDetectorModelUrl: modelUri }
  }
  if (isSsdMobilenetv1(detectorName)) {
    return { ssdMobilenetv1ModelUrl: modelUri }
  }
  if (isMtcnn(detectorName)) {
    return { mtcnnModelUrl: modelUri }
  }

  throw new Error(`getLoadModelsUriFromFaceDetector - invalid face detector: ${detectorName}`)
}