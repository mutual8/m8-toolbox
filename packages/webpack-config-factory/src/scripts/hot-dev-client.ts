/* global window */
import hotDevClient from '../helpers/hot-dev-client'

hotDevClient(window as Window & {
  encodeURIComponent: typeof encodeURIComponent
})
