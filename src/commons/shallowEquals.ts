export function shallowEquals(obj1: any, obj2: any, excludeKeys: string[] = []) {
  const excludeKeysSet = new Set(excludeKeys)

  const keysSet = new Set(
    Object.keys(obj1)
      .concat(Object.keys(obj2))
      .filter(key => !excludeKeysSet.has(key))
  )

  return Array.from(keysSet.values())
    .filter(key => obj1[key] !== obj2[key])
    .length === 0
}