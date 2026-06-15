<template>
  <div class="quiz">
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
        <span>最高连击</span>
        <strong>{{ bestStreak }}</strong>
      </div>
      <div class="hud-item">
        <span>已答</span>
        <strong>{{ answered }}</strong>
      </div>
    </div>

    <div class="stage">
      <p class="prompt">下面这个汉字的拼音是？</p>
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

      <div class="footer">
        <p v-if="picked !== null" class="feedback" :class="{ ok: isCorrect }">
          {{ isCorrect ? '答对了！' : `正确答案：${current.pinyin}` }}
        </p>
        <button v-if="picked !== null" class="next" @click="nextQuestion">下一题 →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { characters } from '../../data/characters'
import { sample, distractors, shuffle } from '../../utils/random'

const allPinyin = characters.map((item) => item.pinyin)

const current = ref(characters[0])
const options = ref([])
const picked = ref(null)
const score = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const answered = ref(0)

const isCorrect = computed(() => picked.value === current.value.pinyin)

function nextQuestion() {
  current.value = sample(characters)
  options.value = shuffle([
    current.value.pinyin,
    ...distractors(allPinyin, current.value.pinyin, 3),
  ])
  picked.value = null
}

function choose(option) {
  if (picked.value !== null) {
    return
  }

  picked.value = option
  answered.value += 1

  if (option === current.value.pinyin) {
    score.value += 10
    streak.value += 1
    bestStreak.value = Math.max(bestStreak.value, streak.value)
  } else {
    streak.value = 0
  }
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

nextQuestion()
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
  transition: 0.15s;
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
</style>
