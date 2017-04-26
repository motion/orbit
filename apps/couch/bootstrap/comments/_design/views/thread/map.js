function(doc) {
  if (doc.type === "comment") {
    emit(doc._id, doc)
  }
}
