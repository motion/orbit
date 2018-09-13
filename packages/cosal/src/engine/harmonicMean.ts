export default function hmean(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError(
      'hmean()::invalid input argument. Must provide an array.',
    )
  }
  var len = arr.length,
    sum = 0,
    val
  for (var i = 0; i < len; i++) {
    val = arr[i]
    if (val <= 0) {
      return NaN
    }
    sum += 1 / val
  }
  return len / sum
}
