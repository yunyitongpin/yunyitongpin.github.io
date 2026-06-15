<template>
  <div class="guess">
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

    <div class="clues">
      <p class="clue-title">根据线索，猜猜是哪个汉字：</p>
      <ul>
        <li><b>字义：</b>{{ current.meaning }}</li>
        <li><b>部件：</b>{{ current.components.join(' ＋ ') }}</li>
        <li><b>结构：</b>{{ current.structure }}（{{ current.strokes }} 画）</li>
        <li><b>字源：</b>{{ current.origin }}</li>
      </ul>
    </div>

    <div class="options">
      <button
        v-for="option in options"
        :key="option.id"
        class="option"
        :class="optionClass(option)"
        :disabled="picked !== null"
        @click="choose(option)"
      >
        {{ option.char }}
      </button>
    </div>

    <div class="footer">
      <p v-if="picked !== null" class="feedback" :class="{ ok: isCorrect }">
        {{ isCorrect ? '答对了！' : `正确答案是「${current.char}」` }}
      </p>
      <button v-if="picked !== null" class="next" @click="nextQuestion">下一题 →</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { characters } from '../../data/characters'
import { sample, distractors, shuffle } from '../../utils/random'

const current = ref(characters[0])
const options = ref([])
const picked = ref(null)
const score = ref(0)
const streak = ref(0)
const answered = ref(0)

const isCorrect = computed(() => picked.value?.id === current.value.id)

function nextQuestion() {
  current.value = sample(characters)
  options.value = shuffle([current.value, ...distractors(characters, current.value, 3)])
  picked.value = null
}

function choose(option) {
  if (picked.value !== null) {
    return
  }

  picked.value = option
  answered.value += 1

  if (option.id === current.value.id) {
    score.value += 10
    streak.value += 1
  } else {
    streak.value = 0
  }
}

function optionClass(option) {
  if (picked.value === null) {
    return ''
  }
  if (option.id === current.value.id) {
    return 'correct'
  }
  if (option.id === picked.value.id) {
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

.clues {
  padding: 20px 22px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  margin-bottom: 22px;
}

.clue-title {
  margin: 0 0 12px;
  color: #6b7280;
}

.clues ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  color: #374151;
  line-height: 1.6;
}

.clues b {
  color: #2f5d50;
}

.options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
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
