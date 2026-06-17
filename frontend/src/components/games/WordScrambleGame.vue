<template>
  <div class="scramble">
    <div class="hud">
      <div class="hud-item">
        <span>得分</span>
        <strong>{{ score }}</strong>
      </div>
      <div class="hud-item">
        <span>已完成</span>
        <strong>{{ solved }}</strong>
      </div>
      <button class="reset" @click="newRound">换一个词</button>
    </div>

    <p class="prompt">点击汉字，把它们排成正确的词语：</p>

    <div class="slots">
      <span
        v-for="(char, index) in building"
        :key="index"
        class="slot filled"
        :class="status"
      >
        {{ char }}
      </span>
      <span
        v-for="n in target.length - building.length"
        :key="`empty-${n}`"
        class="slot"
      ></span>
    </div>

    <div class="pool">
      <button
        v-for="tile in tiles"
        :key="tile.id"
        class="tile"
        :class="{ used: tile.used }"
        :disabled="tile.used || status === 'done'"
        @click="pick(tile)"
      >
        {{ tile.char }}
      </button>
    </div>

    <div class="footer">
      <p v-if="status === 'done'" class="feedback ok">拼对啦：{{ target }} 🎉</p>
      <p v-else-if="status === 'wrong'" class="feedback">顺序不对，正确答案：{{ target }}</p>
      <button v-if="status !== 'playing'" class="next" @click="newRound">下一题 →</button>
      <button v-else class="clear" @click="reset">重选</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { characters } from '../../data/characters'
import { sample, shuffle } from '../../utils/random'

// 取所有多字词语作为题库。
const words = [...new Set(characters.flatMap((c) => c.words))].filter((w) => [...w].length > 1)

const target = ref('')
const tiles = ref([])
const building = ref([])
const status = ref('playing') // playing | done | wrong
const score = ref(0)
const solved = ref(0)

function newRound() {
  target.value = sample(words)
  const chars = [...target.value]
  let order = shuffle(chars)
  // 尽量保证打乱后与原词不同。
  if (chars.length > 1) {
    let guard = 0
    while (order.join('') === target.value && guard < 10) {
      order = shuffle(chars)
      guard += 1
    }
  }
  tiles.value = order.map((char, i) => ({ id: i, char, used: false }))
  building.value = []
  status.value = 'playing'
}

function pick(tile) {
  if (tile.used || status.value !== 'playing') {
    return
  }
  tile.used = true
  building.value = [...building.value, tile.char]
  if (building.value.length === [...target.value].length) {
    if (building.value.join('') === target.value) {
      status.value = 'done'
      score.value += 10
      solved.value += 1
    } else {
      status.value = 'wrong'
    }
  }
}

function reset() {
  tiles.value.forEach((tile) => {
    tile.used = false
  })
  building.value = []
}

newRound()
</script>

<style scoped>
.hud {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
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

.prompt {
  text-align: center;
  color: #6b7280;
  margin: 0 0 18px;
}

.slots {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 26px;
}

.slot {
  width: 64px;
  height: 64px;
  border: 2px dashed #d1d5db;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 34px;
  font-weight: 700;
  color: #174236;
}

.slot.filled {
  border-style: solid;
  border-color: #2f5d50;
  background: #f0f7f4;
}

.slot.done {
  border-color: #16a34a;
  background: #dcfce7;
}

.slot.wrong {
  border-color: #dc2626;
  background: #fee2e2;
}

.pool {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.tile {
  width: 64px;
  height: 64px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: white;
  font-size: 30px;
  font-weight: 700;
  color: #174236;
  cursor: pointer;
  transition: 0.15s;
}

.tile:hover:not(:disabled) {
  border-color: #2f5d50;
  transform: translateY(-3px);
}

.tile.used {
  opacity: 0.3;
  cursor: default;
}

.footer {
  margin-top: 24px;
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
}

.feedback.ok {
  color: #16a34a;
}

.next,
.clear {
  padding: 10px 22px;
  border: none;
  border-radius: 12px;
  background: #2f5d50;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
}

.clear {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.next:hover {
  background: #174236;
}

.clear:hover {
  border-color: #2f5d50;
  color: #2f5d50;
}
</style>
