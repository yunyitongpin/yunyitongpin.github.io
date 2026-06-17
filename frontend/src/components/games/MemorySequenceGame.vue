<template>
  <div class="memory">
    <div class="hud">
      <div class="hud-item">
        <span>当前长度</span>
        <strong>{{ sequence.length }}</strong>
      </div>
      <div class="hud-item">
        <span>最佳</span>
        <strong>{{ best }}</strong>
      </div>
      <button class="reset" @click="start">{{ phase === 'idle' ? '开始游戏' : '重新开始' }}</button>
    </div>

    <p class="hint">{{ hint }}</p>

    <div class="board">
      <button
        v-for="(tile, index) in tiles"
        :key="tile.id"
        class="tile"
        :class="{ active: activeIndex === index, dead: phase === 'over' }"
        :disabled="phase !== 'input'"
        @click="clickTile(index)"
      >
        {{ tile.char }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { characters } from '../../data/characters'
import { shuffle } from '../../utils/random'

const BOARD_SIZE = 6 // 固定 6 个方块的棋盘，题库变大也保持可玩
const tiles = shuffle(characters)
  .slice(0, BOARD_SIZE)
  .map((c) => ({ id: c.id, char: c.char }))

const sequence = ref([]) // 需要复现的方块下标序列
const playerPos = ref(0)
const activeIndex = ref(-1)
const phase = ref('idle') // idle | showing | input | over
const best = ref(0)

const hint = computed(() => {
  if (phase.value === 'idle') {
    return '点击“开始游戏”，记住汉字闪烁的顺序，再依次点出来。'
  }
  if (phase.value === 'showing') {
    return '请注意看……'
  }
  if (phase.value === 'input') {
    return `轮到你了：第 ${playerPos.value + 1} / ${sequence.value.length} 个`
  }
  return `记错啦！这次记住了 ${sequence.value.length - 1} 个。`
})

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function start() {
  sequence.value = []
  playerPos.value = 0
  phase.value = 'showing'
  addStep()
}

async function addStep() {
  sequence.value = [...sequence.value, Math.floor(Math.random() * tiles.length)]
  await playSequence()
}

async function playSequence() {
  phase.value = 'showing'
  activeIndex.value = -1
  await sleep(500)
  for (const idx of sequence.value) {
    activeIndex.value = idx
    await sleep(450)
    activeIndex.value = -1
    await sleep(220)
  }
  phase.value = 'input'
  playerPos.value = 0
}

function clickTile(index) {
  if (phase.value !== 'input') {
    return
  }
  if (index === sequence.value[playerPos.value]) {
    playerPos.value += 1
    if (playerPos.value === sequence.value.length) {
      best.value = Math.max(best.value, sequence.value.length)
      phase.value = 'showing'
      setTimeout(addStep, 600)
    }
  } else {
    phase.value = 'over'
  }
}
</script>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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

.hint {
  margin: 0 0 18px;
  color: #6b7280;
  text-align: center;
  min-height: 22px;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  max-width: 460px;
  margin: 0 auto;
}

.tile {
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

.tile:hover:not(:disabled) {
  border-color: #2f5d50;
  transform: translateY(-3px);
}

.tile.active {
  background: #2f5d50;
  color: white;
  border-color: #174236;
  transform: scale(1.05);
}

.tile.dead {
  opacity: 0.5;
}
</style>
