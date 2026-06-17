<template>
  <div class="match">
    <div class="hud">
      <div class="hud-item">
        <span>步数</span>
        <strong>{{ moves }}</strong>
      </div>
      <div class="hud-item">
        <span>已配对</span>
        <strong>{{ matched.length }} / {{ pool.length }}</strong>
      </div>
      <button class="reset" @click="start">重新开始</button>
    </div>

    <div v-if="won" class="win-banner">
      🎉 全部配对成功！共用 <strong>{{ moves }}</strong> 步。
    </div>

    <div class="board">
      <button
        v-for="card in deck"
        :key="card.key"
        class="card"
        :class="{
          open: isOpen(card),
          matched: matched.includes(card.pairId),
        }"
        :disabled="isOpen(card) || matched.includes(card.pairId)"
        @click="flip(card)"
      >
        <span class="card-face">{{ isOpen(card) ? card.label : '?' }}</span>
        <small v-if="isOpen(card)" class="card-kind">{{
          card.kind === 'char' ? '汉字' : '拼音'
        }}</small>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { characters } from '../../data/characters'
import { shuffle } from '../../utils/random'

const MATCH_SIZE = 8 // 每局随机抽取的汉字数量，避免题库变大后牌面过多

const pool = ref([]) // 本局参与配对的汉字子集
const deck = ref([])
const flipped = ref([]) // 当前翻开但未配对的卡片
const matched = ref([]) // 已配对的 pairId 列表
const moves = ref(0)
const locked = ref(false)

const won = computed(() => pool.value.length > 0 && matched.value.length === pool.value.length)

function buildDeck() {
  const cards = pool.value.flatMap((item) => [
    { key: `c-${item.id}`, pairId: item.id, kind: 'char', label: item.char },
    { key: `p-${item.id}`, pairId: item.id, kind: 'pinyin', label: item.pinyin },
  ])
  return shuffle(cards)
}

function start() {
  pool.value = shuffle(characters).slice(0, MATCH_SIZE)
  deck.value = buildDeck()
  flipped.value = []
  matched.value = []
  moves.value = 0
  locked.value = false
}

function isOpen(card) {
  return flipped.value.some((c) => c.key === card.key)
}

function flip(card) {
  if (locked.value || isOpen(card) || matched.value.includes(card.pairId)) {
    return
  }

  flipped.value = [...flipped.value, card]

  if (flipped.value.length < 2) {
    return
  }

  moves.value += 1
  const [first, second] = flipped.value

  if (first.pairId === second.pairId && first.kind !== second.kind) {
    matched.value = [...matched.value, first.pairId]
    flipped.value = []
    return
  }

  locked.value = true
  setTimeout(() => {
    flipped.value = []
    locked.value = false
  }, 800)
}

start()
</script>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
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

.reset {
  margin-left: auto;
  padding: 10px 18px;
  border: none;
  border-radius: 12px;
  background: #2f5d50;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.reset:hover {
  background: #174236;
}

.win-banner {
  margin-bottom: 18px;
  padding: 14px 18px;
  border-radius: 14px;
  background: #fef3c7;
  color: #92400e;
  text-align: center;
}

.board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.card {
  position: relative;
  aspect-ratio: 3 / 4;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: linear-gradient(135deg, #2f5d50, #174236);
  color: white;
  font-size: 28px;
  cursor: pointer;
  transition: 0.2s;
  display: grid;
  place-items: center;
}

.card:hover:not(:disabled) {
  transform: translateY(-3px);
}

.card.open {
  background: white;
  color: #1f2937;
  border-color: #2f5d50;
}

.card.matched {
  background: #f0f7f4;
  color: #2f5d50;
  border-color: #2f5d50;
  cursor: default;
  opacity: 0.85;
}

.card-kind {
  position: absolute;
  bottom: 8px;
  font-size: 11px;
  color: #6b7280;
}

@media (max-width: 640px) {
  .board {
    grid-template-columns: repeat(3, 1fr);
  }

  .card {
    font-size: 22px;
  }
}
</style>
