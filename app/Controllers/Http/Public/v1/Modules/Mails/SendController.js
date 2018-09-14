'use strict'

const kue = use('Kue')
const Setting = use('App/Models/Setting')
const SendMailToContactJob = use('App/Jobs/Modules/Mails/SendMailToContact')

class SendController {
  async send ({ request, transform }) {
    // Check if public access to the user contact is enabled
    let settings = await Setting.query().firstOrFail()

    if (!settings.user_contact_public_access) {
      throw Error('E_CONTACT_ACCESS_DISABLED: Access to the user contact is disabled.')
    }

    // get data from request
    let requestData = request.only([
      'name',
      'email',
      'subject',
      'content'
    ])

    let contact = await settings.contactUser().fetch()

    this.sendMailToContact({ ...requestData, contact })

    return true
  }

  async sendMailToContact (data) {
    kue.instance
      .create(SendMailToContactJob.key, data)
      .priority('low')
      .attempts(3)
      .backoff({ delay: 10 * 1000, type: 'fixed' })
      .removeOnComplete(true)
      .save()
  }
}

module.exports = SendController
