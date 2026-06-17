<template>
  <div class="speed">
    <div class="hud">
      <div class="hud-item">
        <span>找到</span>
        <strong>{{ score }}</strong>
      </div>
      <div class="hud-item">
        <span>剩余时间</span>
        <strong>{{ timeLeft }}s</strong>
      </div>
      <div class="hud-item">
        <span>最佳</span>
        <strong>{{ best }}</strong>
      </div>
      <button class="reset" @click="start">{{ running ? '重新开始' : '开始游戏' }}</button>
    </div>

    <p v-if="running" class="target">
      快找出：<b>{{ target.char }}</b>（{{ target.pinyin }}）
    </p>
    <p v-else class="target">点击“开始游戏”，30 秒内尽可能多地找出目标汉字！</p>

    <div v-if="!running && score > 0" class="win-banner">
      ⏱ 时间到！这一轮你找到了 <strong>{{ score }}</strong> 个。
    </div>

    <div class="board">
      <button
        v-for="tile in tiles"
        :key="tile.key"
        class="tile"
        :disabled="!running"
        @click="tap(tile)"
      >
        {{ tile.char }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { characters } from '../../data/characters'
import { sample, shuffle } from '../../utils/random'

const GRID = 12
const DURATION = 30

const tiles = ref([])
const target = ref(characters[0])
const score = ref(0)
const timeLeft = ref(DURATION)
const running = ref(false)
const best = ref(0)
let timer = null

function newRound() {
  target.value = sample(characters)
  // 用其它汉字填满网格，再把目标字放进一个随机格子，保证至少出现一次。
  const others = characters.filter((c) => c.char !== target.value.char)
  const cells = Array.from({ length: GRID }, () => sample(others))
  cells[Math.floor(Math.random() * GRID)] = target.value
  tiles.value = shuffle(cells).map((c, i) => ({ key: `${c.char}-${i}`, char: c.char }))
}

function start() {
  clearInterval(timer)
  score.value = 0
  timeLeft.value = DURATION
  running.value = true
  newRound()
  timer = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      clearInterval(timer)
      running.value = false
      best.value = Math.max(best.value, score.value)
    }
  }, 1000)
}

function tap(tile) {
  if (!running.value) {
    return
  }
  if (tile.char === target.value.char) {
    score.value += 1
    newRound()
  } else {
    timeLeft.value = Math.max(0, timeLeft.value - 1) // 点错扣 1 秒
  }
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
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

.target {
  text-align: center;
  color: #6b7280;
  margin: 0 0 16px;
  font-size: 18px;
}

.target b {
  color: #174236;
  font-size: 24px;
}

.win-banner {
  margin-bottom: 16px;
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

.tile {
  aspect-ratio: 1 / 1;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: white;
  font-size: 34px;
  font-weight: 700;
  color: #174236;
  cursor: pointer;
  transition: 0.12s;
}

.tile:hover:not(:disabled) {
  border-color: #2f5d50;
  transform: translateY(-3px);
}

.tile:disabled {
  opacity: 0.5;
  cursor: default;
}

@media (max-width: 640px) {
  .board {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
