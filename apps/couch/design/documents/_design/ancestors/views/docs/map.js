function(doc) {
  emit(doc._id, doc)
  if (doc.parentIds && Array.isArray(doc.parentIds)) {
    for (var parent in doc.parentIds) {
      emit(parent._id, parent)
    }
  }
}
