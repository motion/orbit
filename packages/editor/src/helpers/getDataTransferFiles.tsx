export function getDataTransferFiles(event: React.DragEvent | React.ChangeEvent) {
  let dataTransferItemsList = []

  if ('dataTransfer' in event) {
    const dt = event.dataTransfer
    if (dt.files && dt.files.length) {
      dataTransferItemsList = Array.from(dt.files)
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      dataTransferItemsList = Array.from(dt.items)
    }
  } else if (event.target) {
    if ('files' in event.target) {
      // @ts-ignore
      dataTransferItemsList = event.target.files
    }
  }
  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList)
}
