import Inkscape from "inkscape"

const { ext, config } = envMap.get(process.env.CHIN_ENV)

export default (opts) => {
  opts.ext = ext
  return pipe => pipe(new Inkscape(config))
}

const envMap = new Map([
  ["white", {
    ext: ".png",
    config: [
      '--export-png',
      '--export-area-page',
      '--export-background=#ffffff',
      '--export-width=1024'
    ]
  }],
  ["trans", {
    ext: ".png",
    config: [
      '--export-png',
      '--export-area-page',
      '--export-width=1024'
    ]
  }],
  ["pdf", {
    ext: ".pdf",
    config: [
      '--export-pdf',
      `--export-area-page`,
      '--export-width=1024'
    ]
  }],
  ["print", {
    ext: ".pdf",
    config: [
      '--export-pdf',
      `--export-area-drawing`,
      '--export-width=1024'
    ]
  }]
])
