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

export const MODELS_URI = withPrefix(`/models`)

export const ALIGNED_FACE_IMAGES = ALIGNED_FACE_IMAGES_BY_CLASS
  .reduce((flat, arr) => flat.concat(arr), [])

export const FACE_DETECTORS = ['Tiny Yolo v2', 'SSD Mobilenet v1', 'MTCNN']

export function getLoadModelsUriFromFaceDetector(faceDetector: string, modelUri: string) {
  if (faceDetector === FACE_DETECTORS[0]) {
    return { tinyYolov2ModelUrl: modelUri }
  }
  if (faceDetector === FACE_DETECTORS[1]) {
    return { ssdMobilenetv1ModelUrl: modelUri }
  }
  if (faceDetector === FACE_DETECTORS[2]) {
    return { mtcnnModelUrl: modelUri }
  }

  throw new Error(`getLoadModelsUriFromFaceDetector - invalid face detector: ${faceDetector}`)
}