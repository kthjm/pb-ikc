const Inkscape = require('inkscape')

const inkToPngWhite = opts => {
  opts.ext = '.png'

  return pipe =>
    pipe(
      new Inkscape([
        '--export-png',
        '--export-area-page',
        '--export-background=#ffffff',
        '--export-width=1024'
      ])
    )
}

const inkToPngTrans = opts => {
  opts.ext = '.png'

  return pipe =>
    pipe(
      new Inkscape([
        '--export-png',
        '--export-area-page',
        '--export-width=1024'
      ])
    )
}

const inkToPdf = opts => {
  opts.ext = '.pdf'

  return pipe =>
    pipe(
      new Inkscape([
        '--export-pdf',
        `--export-area-page`,
        '--export-width=1024'
      ])
    )
}

const inkToPrint = opts => {
  opts.ext = '.pdf'

  return pipe =>
    pipe(
      new Inkscape([
        '--export-pdf',
        `--export-area-drawing`,
        '--export-width=1024'
      ])
    )
}

const pdfMerge = require('pdf-merge')
const { normalize, format, resolve } = require('path')
const { remove } = require('fs-extra')

const pdfMap = new Map()

const inkToPdfsToMerge = opts => {
  opts.ext = '.pdf'

  const dirpath = normalize(opts.dir)
  const content = { file: resolve(format(opts)), finish: false }

  if (!pdfMap.has(dirpath)) {
    pdfMap.set(dirpath, [content])
  } else {
    pdfMap.get(dirpath).push(content)
  }

  return (pipe, utils) => {
    utils.writableOn('finish', () => {
      content.finish = true
      const pdfsByDir = pdfMap.get(dirpath)
      const unfinish = pdfsByDir.find(({ finish }) => !finish)
      if (unfinish) {
        return false
      } else {
        const absoluteDirPath = resolve(dirpath)
        const files = pdfsByDir.map(({ file }) => file).sort()

        return pdfMerge(files, { output: `${absoluteDirPath}.pdf` })
          .then(() => remove(absoluteDirPath))
          .catch(err => {
            throw err
          })
      }
    })

    return pipe(
      new Inkscape([
        '--export-pdf',
        `--export-area-page`,
        '--export-width=1024'
      ])
    )
  }
}

module.exports = {
  inkToPngWhite,
  inkToPngTrans,
  inkToPdf,
  inkToPrint,
  inkToPdfsToMerge
}
