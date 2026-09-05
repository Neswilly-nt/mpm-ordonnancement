import type { MPMResult } from '../types/mpm'

const PAGE_WIDTH = 842
const PAGE_HEIGHT = 595
const MARGIN = 32
const WIN_ANSI: Record<string, number> = {
  '€': 128, '‚': 130, 'ƒ': 131, '„': 132, '…': 133, '†': 134, '‡': 135,
  'ˆ': 136, '‰': 137, 'Š': 138, '‹': 139, 'Œ': 140, 'Ž': 142,
  '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151,
  '˜': 152, '™': 153, 'š': 154, '›': 155, 'œ': 156, 'ž': 158, 'Ÿ': 159,
}

type PdfPage = { commands: string[] }

function winAnsi(value: string) {
  let encoded = ''
  for (const character of value.replaceAll('→', '->')) {
    const code = character.codePointAt(0) ?? 63
    encoded += String.fromCharCode(code <= 255 ? code : (WIN_ANSI[character] ?? 63))
  }
  return encoded
}

function escapeText(value: string) {
  return winAnsi(value).replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function textCommand(value: string, x: number, top: number, size = 9, bold = false, color = '0.09 0.15 0.20') {
  return `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${color} rg ${x} ${PAGE_HEIGHT - top} Td (${escapeText(value)}) Tj ET`
}

function rectCommand(x: number, top: number, width: number, height: number, color: string) {
  return `${color} rg ${x} ${PAGE_HEIGHT - top - height} ${width} ${height} re f`
}

function lineCommand(x1: number, top1: number, x2: number, top2: number, color = '0.86 0.90 0.92', width = 0.6) {
  return `${color} RG ${width} w ${x1} ${PAGE_HEIGHT - top1} m ${x2} ${PAGE_HEIGHT - top2} l S`
}

function truncate(value: string, max: number) {
  return value.length <= max ? value : `${value.slice(0, Math.max(1, max - 1))}…`
}

function createPage(pages: PdfPage[], title = 'RAPPORT D’ANALYSE MPM') {
  const page = { commands: [] as string[] }
  pages.push(page)
  page.commands.push(rectCommand(0, 0, PAGE_WIDTH, 55, '0.03 0.25 0.31'))
  page.commands.push(rectCommand(0, 55, PAGE_WIDTH, 4, '0.04 0.51 0.45'))
  page.commands.push(textCommand('MPM PILOT', MARGIN, 25, 15, true, '1 1 1'))
  page.commands.push(textCommand(title, MARGIN, 43, 8, true, '0.72 0.91 0.88'))
  return page
}

function createPdfBytes(pages: PdfPage[]) {
  pages.forEach((page, index) => {
    page.commands.push(lineCommand(MARGIN, 565, PAGE_WIDTH - MARGIN, 565))
    page.commands.push(textCommand(`MPM Pilot · Rapport généré le ${new Date().toLocaleDateString('fr-FR')}`, MARGIN, 580, 7, false, '0.40 0.47 0.52'))
    page.commands.push(textCommand(`Page ${index + 1} / ${pages.length}`, PAGE_WIDTH - 78, 580, 7, true, '0.40 0.47 0.52'))
  })

  const objects: string[] = []
  const pageObjectNumbers = pages.map((_, index) => 5 + index * 2)
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Count ${pages.length} /Kids [${pageObjectNumbers.map(number => `${number} 0 R`).join(' ')}] >>`
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
  pages.forEach((page, index) => {
    const pageNumber = 5 + index * 2
    const contentNumber = pageNumber + 1
    const stream = winAnsi(page.commands.join('\n'))
    objects[pageNumber] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNumber} 0 R >>`
    objects[contentNumber] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
  })

  let binary = '%PDF-1.4\n%âãÏÓ\n'
  const offsets = [0]
  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = binary.length
    binary += `${index} 0 obj\n${objects[index]}\nendobj\n`
  }
  const xref = binary.length
  binary += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
  for (let index = 1; index < objects.length; index += 1) binary += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  binary += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`

  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index) & 0xff
  return bytes
}

export function createAnalysisPdf(result: MPMResult) {
  const pages: PdfPage[] = []
  let page = createPage(pages)
  let top = 86

  page.commands.push(textCommand('Synthèse de l’ordonnancement', MARGIN, top, 18, true))
  page.commands.push(textCommand('Méthode des Potentiels Métra · tâches-sommets et contraintes-arcs', MARGIN, top + 18, 9, false, '0.37 0.45 0.51'))
  top += 37

  const cardWidth = (PAGE_WIDTH - MARGIN * 2 - 20) / 3
  const cards = [
    ['DURÉE MINIMALE', String(result.project_duration)],
    ['TÂCHES CRITIQUES', result.critical_tasks.join(', ') || 'Aucune'],
    ['CHEMINS CRITIQUES', String(result.critical_paths.length)],
  ]
  cards.forEach(([label, value], index) => {
    const x = MARGIN + index * (cardWidth + 10)
    page.commands.push(rectCommand(x, top, cardWidth, 52, index === 0 ? '0.91 0.97 0.96' : '0.97 0.98 0.98'))
    page.commands.push(rectCommand(x, top, 4, 52, index === 0 ? '0.04 0.51 0.45' : '0.95 0.64 0.04'))
    page.commands.push(textCommand(label, x + 13, top + 18, 7, true, '0.38 0.46 0.51'))
    page.commands.push(textCommand(truncate(value, 38), x + 13, top + 39, 12, true))
  })
  top += 75

  page.commands.push(textCommand('Chemin(s) critique(s)', MARGIN, top, 12, true))
  top += 19
  result.critical_paths.forEach((path, index) => {
    page.commands.push(textCommand(`${index + 1}. ${path.join(' -> ')}`, MARGIN + 9, top, 9, false, '0.18 0.25 0.30'))
    top += 16
  })
  top += 12

  const columns = [
    { label: 'Tâche', width: 48 },
    { label: 'Durée', width: 48 },
    { label: 'T.ant.', width: 74 },
    { label: 'T.suc.', width: 74 },
    { label: 'Déb. tôt', width: 70 },
    { label: 'Fin tôt', width: 70 },
    { label: 'Déb. tard', width: 74 },
    { label: 'Fin tard', width: 70 },
    { label: 'MT', width: 58 },
    { label: 'ML', width: 58 },
  ]
  const tableWidth = columns.reduce((sum, column) => sum + column.width, 0)
  const drawTableHeader = () => {
    page.commands.push(textCommand('Tableau d’ordonnancement MPM', MARGIN, top, 12, true))
    top += 13
    page.commands.push(rectCommand(MARGIN, top, tableWidth, 23, '0.03 0.25 0.31'))
    let x = MARGIN
    columns.forEach(column => {
      page.commands.push(textCommand(column.label, x + 5, top + 15, 7, true, '1 1 1'))
      x += column.width
    })
    top += 23
  }
  drawTableHeader()

  result.tasks.forEach((task, index) => {
    if (top + 22 > 555) {
      page = createPage(pages, 'TABLEAU D’ORDONNANCEMENT MPM')
      top = 82
      drawTableHeader()
    }
    const values = [
      task.id,
      String(task.duration),
      task.predecessors.join(', ') || 'Début',
      task.successors.join(', ') || 'Fin',
      String(task.earliest_start),
      String(task.earliest_finish),
      String(task.latest_start),
      String(task.latest_finish),
      String(task.total_float),
      String(task.free_float),
    ]
    const background = task.is_critical ? '1 0.98 0.91' : (index % 2 ? '0.97 0.98 0.98' : '1 1 1')
    page.commands.push(rectCommand(MARGIN, top, tableWidth, 21, background))
    if (task.is_critical) page.commands.push(rectCommand(MARGIN, top, 3, 21, '0.95 0.64 0.04'))
    let x = MARGIN
    values.forEach((value, columnIndex) => {
      page.commands.push(textCommand(truncate(value, columnIndex === 2 || columnIndex === 3 ? 15 : 10), x + 5, top + 14, 7.4, columnIndex === 0, task.is_critical ? '0.35 0.25 0.03' : '0.14 0.19 0.23'))
      x += columns[columnIndex].width
    })
    page.commands.push(lineCommand(MARGIN, top + 21, MARGIN + tableWidth, top + 21))
    top += 21
  })

  if (top + 115 > 555) {
    page = createPage(pages, 'LÉGENDES ET CONVENTIONS')
    top = 85
  } else {
    top += 25
  }
  page.commands.push(textCommand('Légendes et conventions', MARGIN, top, 12, true))
  top += 22
  const glossary = [
    ['T.ant.', 'Tâche(s) antérieure(s) ou antécédente(s).'],
    ['T.suc.', 'Tâche(s) successive(s).'],
    ['Début tôt', 'Première date possible de commencement.'],
    ['Début tard', 'Dernière date de début sans retarder le projet.'],
    ['MT', 'Marge totale : retard maximal sans retarder le projet.'],
    ['ML', 'Marge libre : retard sans décaler le début tôt d’un successeur.'],
  ]
  glossary.forEach(([term, definition], index) => {
    const column = index % 2
    const row = Math.floor(index / 2)
    const x = MARGIN + column * 386
    const y = top + row * 26
    page.commands.push(textCommand(term, x, y, 8, true, '0.03 0.25 0.31'))
    page.commands.push(textCommand(definition, x + 72, y, 7.5, false, '0.37 0.45 0.51'))
  })

  const bytes = createPdfBytes(pages)
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
}

export function downloadAnalysisPdf(result: MPMResult) {
  const blob = createAnalysisPdf(result)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `rapport-mpm-${date}.pdf`
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
