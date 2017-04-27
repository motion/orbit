function(newDoc, oldDoc, userCtx, secObj) {
  if (newDoc.title === 'poop') {
    throw { forbidden: 'heyo' }
  }
}
