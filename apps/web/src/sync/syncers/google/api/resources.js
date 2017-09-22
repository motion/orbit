// from https://github.com/gadventures/gapi-js

export default class GapiResources {
  constructor() {
    this.resource = null
  }

  get countries() {
    this.resource = 'countries'
    return this
  }
  set countries(value) {
    return this
  }

  get places() {
    this.resource = 'places'
    return this
  }
  set places(value) {
    return this
  }

  get dossiers() {
    this.resource = 'dossiers'
    return this
  }
  set dossiers(value) {
    return this
  }

  get country_dossiers() {
    this.resource = 'country_dossiers'
    return this
  }
  set country_dossiers(value) {
    return this
  }

  get place_dossiers() {
    this.resource = 'place_dossiers'
    return this
  }
  set place_dossiers(value) {
    return this
  }

  get transport_dossiers() {
    this.resource = 'transport_dossiers'
    return this
  }
  set transport_dossiers(value) {
    return this
  }

  get activity_dossiers() {
    this.resource = 'activity_dossiers'
    return this
  }
  set activity_dossiers(value) {
    return this
  }

  get accommodation_dossiers() {
    this.resource = 'accommodation_dossiers'
    return this
  }
  set accommodation_dossiers(value) {
    return this
  }

  get features() {
    this.resource = 'features'
    return this
  }
  set features(value) {
    return this
  }

  get dossier_features() {
    this.resource = 'dossier_features'
    return this
  }
  set dossier_features(value) {
    return this
  }

  get dossier_segments() {
    this.resource = 'dossier_segments'
    return this
  }
  set dossier_segments(value) {
    return this
  }

  get tour_categories() {
    this.resource = 'tour_categories'
    return this
  }
  set tour_categories(value) {
    return this
  }

  get reporting_offices() {
    this.resource = 'reporting_offices'
    return this
  }
  set reporting_offices(value) {
    return this
  }

  get itineraries() {
    this.resource = 'itineraries'
    return this
  }
  set itineraries(value) {
    return this
  }

  get images() {
    this.resource = 'images'
    return this
  }
  set images(value) {
    return this
  }

  get videos() {
    this.resource = 'videos'
    return this
  }
  set videos(value) {
    return this
  }
}
