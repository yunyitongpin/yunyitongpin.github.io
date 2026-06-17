<template>
  <div class="attack">
    <div class="hud">
      <div class="hud-item">
        <span>得分</span>
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
      <button class="reset" @click="start">{{ running ? '重新开始' : '开始挑战' }}</button>
    </div>

    <div v-if="!running" class="intro">
      <p v-if="finished" class="win-banner">
        ⏱ 时间到！本轮答对 <strong>{{ score }}</strong> 题。
      </p>
      <p class="tip">30 秒内看汉字选拼音，答对越多越好，答错不扣分。</p>
    </div>

    <div v-else class="stage">
      <p class="prompt">这个汉字的拼音是？</p>
      <div class="char">{{ current.char }}</div>
      <div class="options">
        <button
          v-for="option in options"
          :key="option"
          class="option"
          :class="optionClass(option)"
          :disabled="picked !== null"
          @click="choose(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { characters } from '../../data/characters'
import { sample, distractors, shuffle } from '../../utils/random'

const DURATION = 30
const allPinyin = characters.map((c) => c.pinyin)

const current = ref(characters[0])
const options = ref([])
const picked = ref(null)
const score = ref(0)
const timeLeft = ref(DURATION)
const running = ref(false)
const finished = ref(false)
const best = ref(0)
let timer = null

function nextQuestion() {
  current.value = sample(characters)
  options.value = shuffle([current.value.pinyin, ...distractors(allPinyin, current.value.pinyin, 3)])
  picked.value = null
}

function start() {
  clearInterval(timer)
  score.value = 0
  timeLeft.value = DURATION
  running.value = true
  finished.value = false
  nextQuestion()
  timer = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) {
      clearInterval(timer)
      running.value = false
      finished.value = true
      best.value = Math.max(best.value, score.value)
    }
  }, 1000)
}

function choose(option) {
  if (!running.value || picked.value !== null) {
    return
  }
  picked.value = option
  if (option === current.value.pinyin) {
    score.value += 1
  }
  setTimeout(() => {
    if (running.value) {
      nextQuestion()
    }
  }, 320)
}

function optionClass(option) {
  if (picked.value === null) {
    return ''
  }
  if (option === current.value.pinyin) {
    return 'correct'
  }
  if (option === picked.value) {
    return 'wrong'
  }
  return 'dimmed'
}

onUnmounted(() => clearInterval(timer))
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

.intro {
  text-align: center;
}

.tip {
  color: #6b7280;
}

.win-banner {
  margin: 0 auto 16px;
  max-width: 460px;
  padding: 14px 18px;
  border-radius: 14px;
  background: #fef3c7;
  color: #92400e;
}

.stage {
  text-align: center;
}

.prompt {
  color: #6b7280;
  margin: 0 0 12px;
}

.char {
  font-size: 96px;
  line-height: 1.1;
  font-weight: 700;
  color: #174236;
  margin-bottom: 24px;
}

.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  max-width: 460px;
  margin: 0 auto;
}

.option {
  padding: 16px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: white;
  font-size: 22px;
  cursor: pointer;
  transition: 0.12s;
}

.option:hover:not(:disabled) {
  border-color: #2f5d50;
  transform: translateY(-2px);
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
  opacity: 0.55;
}
</style>
