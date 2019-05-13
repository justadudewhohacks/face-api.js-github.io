import { withPrefix } from 'gatsby-link';

export const DOCS_URI = withPrefix('/docs/globals.html')

export const EXAMPLE_IMAGES = [1, 2, 3, 4, 5]
  .map(idx => `bbt${idx}.jpg`)
  .map(label => ({
    label,
    url: withPrefix(`/images/${label}`)
  }))

export const EXAMPLE_IMAGES_FACE_EXPRESSIONS = [
  'happy',
  'sad',
  'angry',
  'disgusted',
  'surprised',
  'fearful',
  'neutral'
]
  .map(expression => `${expression}.jpg`)
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

export const EXAMPLE_VIDEOS = [
  `bbt.mp4`
].map(label => ({
  label,
  url: withPrefix(`/media/${label}`)
}))

export const MODELS_URI = withPrefix(`/models`)

export const ALIGNED_FACE_IMAGES = ALIGNED_FACE_IMAGES_BY_CLASS
  .reduce((flat, arr) => flat.concat(arr), [])