import Inkscape from "inkscape"
import pdfMerge from 'pdf-merge'
import { normalize, format, resolve } from 'path'
import { remove } from 'fs-extra'

const dirAndPdfs = new Map()

export default (opts) => {

  opts.ext = '.pdf'

  const dirpath = normalize(opts.dir)
  const pdf = { filepath: resolve(format(opts)), finish: false }

  if (!dirAndPdfs.has(dirpath)) {
    dirAndPdfs.set(dirpath, [ pdf ])
  } else {
    dirAndPdfs.get(dirpath).push(pdf)
  }

  return (pipe, util) => {

    util.writableOn('finish', () => {

      pdf.finish = true

      const pdfs = dirAndPdfs.get(dirpath)
      return pdfs.every(({ finish }) => finish) &&
      mergeout({
        outdir: resolve(dirpath),
        filepaths: pdfs.map(({ filepath }) => filepath).sort()
      })
    })

    return pipe(new Inkscape(config))
  }
}

const config = [
  '--export-pdf',
  `--export-area-page`,
  '--export-width=1024'
]

const mergeout = ({ outdir, filepaths }) =>
  pdfMerge(filepaths, { output: `${outdir}.pdf` })
    .then(() => remove(outdir))
    .catch(err => { throw err })