<template>
  <div class="input-game">
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

    <div class="stage">
      <p class="prompt">请输入这个汉字的拼音（可不带声调）：</p>
      <div class="char">{{ current.char }}</div>

      <form class="entry" @submit.prevent="submit">
        <input
          ref="box"
          v-model="guess"
          class="field"
          :disabled="submitted"
          placeholder="例如 ri / rì"
          autocomplete="off"
        />
        <button v-if="!submitted" class="action" type="submit">提交</button>
        <button v-else class="action" type="button" @click="nextQuestion">下一题 →</button>
      </form>

      <p v-if="submitted" class="feedback" :class="{ ok: correct }">
        {{ correct ? '答对了！' : `正确答案：${current.pinyin}` }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { characters } from '../../data/characters'
import { sample } from '../../utils/random'

const current = ref(sample(characters))
const guess = ref('')
const submitted = ref(false)
const correct = ref(false)
const score = ref(0)
const streak = ref(0)
const answered = ref(0)
const box = ref(null)

// 去掉声调、空格后比较，初学者输入无声调拼音也算正确。
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase()
}

function submit() {
  if (submitted.value || guess.value.trim() === '') {
    return
  }
  submitted.value = true
  answered.value += 1
  correct.value = normalize(guess.value) === normalize(current.value.pinyin)
  if (correct.value) {
    score.value += 10
    streak.value += 1
  } else {
    streak.value = 0
  }
}

async function nextQuestion() {
  current.value = sample(characters)
  guess.value = ''
  submitted.value = false
  correct.value = false
  await nextTick()
  box.value?.focus()
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

.entry {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.field {
  width: 240px;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  font-size: 20px;
  text-align: center;
}

.field:focus {
  outline: none;
  border-color: #2f5d50;
}

.action {
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  background: #2f5d50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.action:hover {
  background: #174236;
}

.feedback {
  margin: 18px 0 0;
  font-size: 16px;
  color: #dc2626;
}

.feedback.ok {
  color: #16a34a;
}
</style>
