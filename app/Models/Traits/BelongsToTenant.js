'use strict'

class BelongsToTenant {
  register (Model, customOptions = {}) {
    // Add a query scope to limit query to one tenant
    Model.scopeForTenant = (query, id) => {
      return query.where('tenant_id', id)
    }
  }
}

module.exports = BelongsToTenant
