export const HL_PAD = 2
export const TOP_BAR_PAD = 22
export const LINE_Y_ADJ = -5

export function toTarget(quadTreeItem) {
  if (!quadTreeItem) return null
  return {
    left: quadTreeItem.x,
    top: quadTreeItem.y,
    width: quadTreeItem.w,
    height: quadTreeItem.h,
    key: quadTreeItem.string,
  }
}
