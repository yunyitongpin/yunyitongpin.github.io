// 返回打乱顺序的新数组（Fisher–Yates，不修改原数组）。
export function shuffle(list) {
  const result = list.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 从数组中随机取一个元素。
export function sample(list) {
  return list[Math.floor(Math.random() * list.length)]
}

// 取 count 个干扰项：从 pool 中排除 exclude，随机选取后返回。
export function distractors(pool, exclude, count) {
  return shuffle(pool.filter((item) => item !== exclude)).slice(0, count)
}
