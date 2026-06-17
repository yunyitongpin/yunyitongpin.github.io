<template>
  <div class="flashcard">
    <div class="hud">
      <div class="hud-item">
        <span>进度</span>
        <strong>{{ Math.min(index + 1, deck.length) }} / {{ deck.length }}</strong>
      </div>
      <div class="hud-item">
        <span>认识</span>
        <strong>{{ known }}</strong>
      </div>
      <div class="hud-item">
        <span>还不熟</span>
        <strong>{{ unsure }}</strong>
      </div>
      <button class="reset" @click="start">重新洗牌</button>
    </div>

    <div v-if="!finished" class="card-area">
      <button class="card" :class="{ flipped }" @click="flipped = !flipped">
        <div v-if="!flipped" class="face front">
          <span class="big">{{ card.char }}</span>
          <small>点击卡片查看释义</small>
        </div>
        <div v-else class="face back">
          <p class="pinyin">{{ card.pinyin }} · HSK{{ card.hskLevel }}</p>
          <p class="meaning">{{ card.meaning }}</p>
          <p class="words">组词：{{ card.words.join('、') }}</p>
        </div>
      </button>

      <div class="actions">
        <button class="mark unsure" @click="mark(false)">还不熟</button>
        <button class="mark known" @click="mark(true)">认识 ✓</button>
      </div>
    </div>

    <div v-else class="summary">
      <p class="win-banner">
        📚 这一轮复习完成！认识 <strong>{{ known }}</strong> 个，还不熟 <strong>{{ unsure }}</strong> 个。
      </p>
      <button class="next" @click="start">再来一轮 →</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { characters } from '../../data/characters'
import { shuffle } from '../../utils/random'

const deck = ref(shuffle(characters))
const index = ref(0)
const flipped = ref(false)
const known = ref(0)
const unsure = ref(0)

const card = computed(() => deck.value[index.value])
const finished = computed(() => index.value >= deck.value.length)

function start() {
  deck.value = shuffle(characters)
  index.value = 0
  flipped.value = false
  known.value = 0
  unsure.value = 0
}

function mark(isKnown) {
  if (finished.value) {
    return
  }
  if (isKnown) {
    known.value += 1
  } else {
    unsure.value += 1
  }
  index.value += 1
  flipped.value = false
}
</script>

<style scoped>
.hud {
  display: flex;
  align-items: center;
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

.card-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
}

.card {
  width: 100%;
  max-width: 420px;
  min-height: 260px;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  background: white;
  cursor: pointer;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
  transition: 0.2s;
  padding: 24px;
}

.card:hover {
  transform: translateY(-4px);
  border-color: #2f5d50;
}

.card.flipped {
  background: #f0f7f4;
}

.face {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 210px;
}

.big {
  font-size: 110px;
  line-height: 1;
  font-weight: 700;
  color: #174236;
}

.front small {
  color: #9ca3af;
}

.back .pinyin {
  margin: 0;
  font-size: 22px;
  color: #2f5d50;
  font-weight: 600;
}

.back .meaning {
  margin: 0;
  font-size: 18px;
  color: #374151;
}

.back .words {
  margin: 0;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 14px;
}

.mark {
  padding: 12px 28px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.mark.known {
  background: #2f5d50;
  border-color: #2f5d50;
  color: white;
}

.mark.known:hover {
  background: #174236;
}

.mark.unsure {
  background: white;
  color: #92400e;
  border-color: #fcd34d;
}

.mark.unsure:hover {
  background: #fffbeb;
}

.summary {
  text-align: center;
}

.win-banner {
  margin: 0 auto 18px;
  max-width: 460px;
  padding: 16px 18px;
  border-radius: 14px;
  background: #fef3c7;
  color: #92400e;
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
</style>
