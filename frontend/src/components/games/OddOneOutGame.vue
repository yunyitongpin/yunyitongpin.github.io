<template>
  <div class="odd">
    <div class="hud">
      <div class="hud-item">
        <span>得分</span>
        <strong>{{ score }}</strong>
      </div>
      <div class="hud-item">
        <span>连击</span>
        <strong>{{ streak }}</strong>
      </div>
      <div class="hud-item">
        <span>已答</span>
        <strong>{{ answered }}</strong>
      </div>
    </div>

    <p class="prompt">下面哪个字的{{ round.label }}与众不同？</p>

    <div class="options">
      <button
        v-for="item in round.items"
        :key="item.id"
        class="option"
        :class="optionClass(item)"
        :disabled="picked !== null"
        @click="choose(item)"
      >
        {{ item.char }}
      </button>
    </div>

    <div class="footer">
      <p v-if="picked !== null" class="feedback" :class="{ ok: isCorrect }">
        {{ feedback }}
      </p>
      <button v-if="picked !== null" class="next" @click="nextRound">下一题 →</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { characters } from '../../data/characters'
import { sample, shuffle } from '../../utils/random'

// 按某一属性把汉字分组，找出存在“多数派（≥3）”的属性取值，
// 题目从多数派取 3 个，再混入 1 个不同取值的字作为“与众不同”的答案。
const attributes = [
  { field: 'structure', label: '结构', format: (v) => v },
  { field: 'hskLevel', label: 'HSK 等级', format: (v) => `HSK ${v}` },
]

function buildCandidates() {
  const candidates = []
  for (const attr of attributes) {
    const groups = new Map()
    for (const c of characters) {
      const key = c[attr.field]
      groups.set(key, [...(groups.get(key) || []), c])
    }
    for (const [value, members] of groups) {
      const outsiders = characters.filter((c) => c[attr.field] !== value)
      if (members.length >= 3 && outsiders.length > 0) {
        candidates.push({ attr, value, members, outsiders })
      }
    }
  }
  return candidates
}

const candidates = buildCandidates()

const round = ref(makeRound())
const picked = ref(null)
const score = ref(0)
const streak = ref(0)
const answered = ref(0)

const isCorrect = computed(() => picked.value && picked.value.id === round.value.odd.id)
const feedback = computed(() => {
  if (picked.value === null) {
    return ''
  }
  const { attr, value, odd } = round.value
  if (isCorrect.value) {
    return '答对了！'
  }
  return `「${odd.char}」的${attr.label}是「${attr.format(odd[attr.field])}」，其余都是「${attr.format(value)}」。`
})

function makeRound() {
  const pick = sample(candidates)
  const same = shuffle(pick.members).slice(0, 3)
  const odd = sample(pick.outsiders)
  return {
    label: pick.attr.label,
    attr: pick.attr,
    value: pick.value,
    odd,
    items: shuffle([...same, odd]),
  }
}

function choose(item) {
  if (picked.value !== null) {
    return
  }
  picked.value = item
  answered.value += 1
  if (item.id === round.value.odd.id) {
    score.value += 10
    streak.value += 1
  } else {
    streak.value = 0
  }
}

function optionClass(item) {
  if (picked.value === null) {
    return ''
  }
  if (item.id === round.value.odd.id) {
    return 'correct'
  }
  if (item.id === picked.value.id) {
    return 'wrong'
  }
  return 'dimmed'
}

function nextRound() {
  round.value = makeRound()
  picked.value = null
}
</script>

<style scoped>
.hud {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}

.hud-item {
  display: flex;
  flex-direction: column;
  padding: 8px 16px;
  border-radius: 12px;
  background: #f0f7f4;
}

.hud-item span {
  font-size: 12px;
  color: #6b7280;
}

.hud-item strong {
  font-size: 18px;
  color: #2f5d50;
}

.prompt {
  text-align: center;
  color: #6b7280;
  margin: 0 0 22px;
  font-size: 18px;
}

.options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  max-width: 520px;
  margin: 0 auto;
}

.option {
  aspect-ratio: 1 / 1;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  background: white;
  font-size: 40px;
  font-weight: 700;
  color: #174236;
  cursor: pointer;
  transition: 0.15s;
}

.option:hover:not(:disabled) {
  border-color: #2f5d50;
  transform: translateY(-3px);
}

.option.correct {
  background: #dcfce7;
  border-color: #16a34a;
  color: #166534;
}

.option.wrong {
  background: #fee2e2;
  border-color: #dc2626;
  color: #991b1b;
}

.option.dimmed {
  opacity: 0.5;
}

.footer {
  margin-top: 22px;
  min-height: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.feedback {
  margin: 0;
  font-size: 16px;
  color: #dc2626;
  text-align: center;
}

.feedback.ok {
  color: #16a34a;
}

.next {
  padding: 10px 22px;
  border: none;
  border-radius: 12px;
  background: #2f5d50;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}

.next:hover {
  background: #174236;
}

@media (max-width: 640px) {
  .options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
