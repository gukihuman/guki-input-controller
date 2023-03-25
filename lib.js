function cloneDeep(value) {
  if (typeof value !== "object" || value === null) {
    return value
  }

  const result = Array.isArray(value) ? [] : {}

  for (const key in value) {
    result[key] = cloneDeep(value[key])
  }

  return result
}
function remove(array, predicate) {
  let index = -1
  let length = array == null ? 0 : array.length
  const result = []

  while (++index < length) {
    const value = array[index]
    if (predicate(value, index, array)) {
      result.push(value)
      array.splice(index--, 1)
      length--
    }
  }
  return result
}

module.exports = {
  cloneDeep,
  remove,
}
