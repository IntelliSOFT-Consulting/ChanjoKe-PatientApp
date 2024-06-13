export const getOffset = (page, pageSize = 12) => {
  return Math.abs(page <= 1 ? 0 : (page - 1) * pageSize)
}