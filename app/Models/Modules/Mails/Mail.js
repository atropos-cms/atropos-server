'use strict'

const Model = use('Model')

class Mail extends Model {
  static boot () {
    super.boot()

    this.addTrait('App/Models/Traits/Uuid')
  }

  static get incrementing () {
    return false
  }

  static get table () {
    return 'modules_mail_mails'
  }

  sender () {
    return this.belongsTo('App/Models/User', 'sender_id')
  }

  users () {
    return this.belongsToMany('App/Models/User').pivotTable('modules_mail_mails_recipient_users')
  }

  lists () {
    return this.belongsToMany('App/Models/Modules/Mails/List').pivotTable('modules_mail_mails_recipient_lists')
  }

  attachments () {
    return this.belongsToMany('App/Models/Modules/Media/File').pivotTable('modules_mail_mails_attachments')
  }
}

module.exports = Mail
