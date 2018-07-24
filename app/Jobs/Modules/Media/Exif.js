'use strict'

const Drive = use('Drive')
const Job = use('App/Jobs/Job')
const moment = require('moment')
const sizeOf = require('image-size')
const { ExifImage } = require('exif')
const File = use('App/Models/Modules/Media/File')

class Exif extends Job {
  static get key () {
    return 'modules-media-exif'
  }

  async handle (fileEntity) {
    await this.init()

    // load the file from the store
    const file = await Drive.get(`media/${fileEntity.storage_file}`)

    // process the exif from the file
    let raw = {}
    try {
      raw = Object.assign(raw, await this.parseEXIF(file))
    } catch (error) {
      // if there was an error when processing exif data, return without throwing an error
    }

    try {
      raw = Object.assign(raw, {dimensions: sizeOf(file)})
    } catch (error) {
      // if there was an error when processing exif data, return without throwing an error
    }

    let exif = await this.processExif(raw)

    // get the file entity and updates exif data
    fileEntity = await File.findByOrFail('id', fileEntity.id)
    fileEntity.exif = JSON.stringify(exif)
    await fileEntity.save()

    this.completed('Modules/Media/Exif', `Extracted EXIF for '${fileEntity.id}'`)
  }

  async parseEXIF (file) {
    return new Promise((resolve, reject) => {
      ExifImage({ image: file }, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  }

  async processExif (raw) {
    // only the following values will be parsed
    const allowed = [
      'height',
      'width',
      'type',
      'Make',
      'Model',
      'Orientation',
      'CreateDate',
      'Software',
      'ModifyDat',
      'ExposureTime',
      'FNumber',
      'ISO',
      'BrightnessValue',
      'MaxApertureValue',
      'Flash',
      'FocalLength',
      'ExposureMode',
      'LensModel',
      'GPSLatitudeRef',
      'GPSLatitude',
      'GPSLongitudeRef',
      'GPSLongitude',
      'GPSAltitudeRef',
      'GPSAltitude',
      'GPSTimeStamp',
      'GPSSpeedRef',
      'GPSSpeed',
      'GPSImgDirectionRef',
      'GPSImgDirection',
      'GPSDestBearingRef',
      'GPSDestBearing',
      'GPSDateStamp'
    ]

    raw = { ...raw.image, ...raw.exif, ...raw.gps, ...raw.dimensions }

    // filter out all values that are not allowd
    let filtered = Object.keys(raw)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = raw[key]
        return obj
      }, {})

    // sanitize date values
    if (filtered['CreateDate']) {
      filtered['CreateDate'] = moment(filtered['CreateDate'], 'YYYY:MM:DD HH:mm:ss').toISOString()
    }

    return filtered
  }
}

module.exports = Exif
