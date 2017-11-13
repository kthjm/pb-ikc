import Inkscape from "inkscape"
import envmap from "./envmap.js"

const { ext, config } = envmap.get(process.env.CHIN_ENV) || {}

export default (opts) => {
  opts.ext = ext
  return pipe => pipe(new Inkscape(config))
}
