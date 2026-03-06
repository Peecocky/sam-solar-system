export type TetrominoType = 'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z'

export type Cell = { x: number; y: number }

export type MessageBlockInput = {
  id: number | string
  tetromino: TetrominoType
  columnIndex: number
  createdAt: string | number | Date
}

export type PlacedMessageBlock = MessageBlockInput & {
  originX: number
  originY: number
  cells: Cell[]
}

export const BOARD_COLS = 10

const SHAPES: Record<TetrominoType, Cell[]> = {
  I: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 },
  ],
  O: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  T: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 1, y: 1 },
  ],
  L: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  J: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: 2 },
    { x: 0, y: 2 },
  ],
  S: [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],
  Z: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
  ],
}

function normalizeColumn(shape: Cell[], columnIndex: number) {
  const maxX = Math.max(...shape.map((c) => c.x))
  const clamped = Math.max(0, Math.min(columnIndex, BOARD_COLS - 1 - maxX))
  return clamped
}

function key(x: number, y: number) {
  return `${x},${y}`
}

function collides(shape: Cell[], ox: number, oy: number, occupied: Set<string>) {
  for (const c of shape) {
    const x = ox + c.x
    const y = oy + c.y

    if (x < 0 || x >= BOARD_COLS) return true
    if (y < 0) return true
    if (occupied.has(key(x, y))) return true
  }
  return false
}

function findDropY(shape: Cell[], ox: number, occupied: Set<string>) {
  let y = 0

  while (!collides(shape, ox, y, occupied)) {
    y += 1
  }

  return y - 1
}

/**
 * 布局规则：
 * - 以“底部 = y=0”的坐标系计算
 * - 最早的消息先落下
 * - 删除某条消息后，只要它不在 active 列表里，重新布局即可自动重力补位
 */
export function layoutMessageBlocks(
  items: MessageBlockInput[]
): PlacedMessageBlock[] {
  const sorted = [...items].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  const occupied = new Set<string>()
  const placed: PlacedMessageBlock[] = []

  for (const item of sorted) {
    const shape = SHAPES[item.tetromino]
    const ox = normalizeColumn(shape, item.columnIndex)
    const oy = findDropY(shape, ox, occupied)

    const absoluteCells = shape.map((c) => ({
      x: ox + c.x,
      y: oy + c.y,
    }))

    for (const c of absoluteCells) {
      occupied.add(key(c.x, c.y))
    }

    placed.push({
      ...item,
      originX: ox,
      originY: oy,
      cells: absoluteCells,
    })
  }

  return placed
}

export function getBoardHeight(blocks: PlacedMessageBlock[]) {
  if (blocks.length === 0) return 12
  let maxY = 0
  for (const block of blocks) {
    for (const c of block.cells) {
      if (c.y > maxY) maxY = c.y
    }
  }
  return Math.max(12, maxY + 1)
}

export function randomTetromino(): TetrominoType {
  const all: TetrominoType[] = ['I', 'O', 'T', 'L', 'J', 'S', 'Z']
  return all[Math.floor(Math.random() * all.length)]
}