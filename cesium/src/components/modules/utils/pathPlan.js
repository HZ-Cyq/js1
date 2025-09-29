// utils/pathPlanner.js

/**
 * 生成简化威胁图（雷达中心周围高威胁）
 * 返回一个 2D 数组：每个元素是威胁值（0~1）
 */
export function generateThreatMap(rows, cols, radarCenters) {
    const threatMap = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => 0)
    )
  
    radarCenters.forEach(({ x, y, range }) => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const dx = j - x
          const dy = i - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist <= range) {
            threatMap[i][j] += (range - dist) / range // 越近威胁越大
          }
        }
      }
    })
  
    return threatMap
  }
  
  /**
   * A* 算法求最小威胁路径（简化版）
   */
  export function findLowestThreatPath(threatMap, start, end) {
    const rows = threatMap.length
    const cols = threatMap[0].length
  
    const open = [{ ...start, g: 0, f: 0, path: [] }]
    const visited = new Set()
  
    const key = (x, y) => `${x},${y}`
  
    while (open.length > 0) {
      open.sort((a, b) => a.f - b.f)
      const curr = open.shift()
      const { x, y, g, path } = curr
  
      if (x === end.x && y === end.y) {
        return [...path, { x, y }]
      }
  
      visited.add(key(x, y))
  
      for (const [dx, dy] of [
        [1, 0], [-1, 0], [0, 1], [0, -1]
      ]) {
        const nx = x + dx
        const ny = y + dy
        if (
          nx < 0 || nx >= cols || ny < 0 || ny >= rows ||
          visited.has(key(nx, ny))
        ) continue
  
        const newG = g + threatMap[ny][nx] + 1 // 加1是基础移动代价
        const h = Math.abs(nx - end.x) + Math.abs(ny - end.y)
        open.push({
          x: nx, y: ny,
          g: newG,
          f: newG + h,
          path: [...path, { x, y }]
        })
      }
    }
  
    return [] // 找不到
  }
  