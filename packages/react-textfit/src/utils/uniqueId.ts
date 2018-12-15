let uid = 0

export default function uniqueId() {
  uid += 1
  return uid
}
