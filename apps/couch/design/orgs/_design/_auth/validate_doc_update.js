function validateOrgUpdate(newDoc, oldDoc, userCtx, secObj) {
  if (userCtx.roles.indexOf('_admin') === -1) {
    throw { forbidden: 'Only admin can update orgs' }
  }
}
