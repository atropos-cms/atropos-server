const Antl = use('Antl')
const View = use('View')
const Config = use('Config')
const { Command } = use('@adonisjs/ace')
const Setting = use('App/Models/Setting')

class Job extends Command {
  async init ({user} = {}) {
    // Instantiate Antl
    this.antl = Antl
    await this.antl.bootLoader()

    // Load settings
    let settings = {}
    try {
      settings = await Setting.query().firstOrFail()
    } catch (e) {}

    // Set the locale to the application local
    await this.setLocale(settings)

    // Register branding
    await this.loadBranding(settings)

    // Pass the antl to the mail view.
    await View.global('antl', this.antl)
  }

  async setLocale (settings = {}) {
    // Fetch Locale from settings or from config
    let locale = settings.locale || Config.get('app.locales.locale')

    this.antl = this.antl.forLocale(locale)
  }

  async loadBranding (settings = {}) {
    this.branding = {
      abbreviation: settings.branding_abbreviation || 'A',
      name: settings.branding_name || 'Atropos',
      color: settings.branding_color || '#409EFF'
    }

    // Register branging name and color globaly accessible
    View.global('branding', this.branding)
  }
}

module.exports = Job
