export const EXAMPLE_IMAGES = [1, 2, 3, 4, 5]
  .map(idx => `bbt${idx}.jpg`)
  .map(label => ({
    label,
    url: `images/${label}`
  }))


export const ALIGNED_FACE_IMAGES = ['amy', 'bernadette', 'howard', 'leonard', 'penny', 'raj', 'sheldon', 'stuart']
  .map(
    clazz => [1, 2, 3, 4, 5]
      .map(idx => `${clazz}${idx}.png`)
      .map(label => ({
        label,
        url: `images/${clazz}/${label}`
      }))
  )
  .reduce((flat, arr) => flat.concat(arr), [])
