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
      <p class="prompt">{{ question }}</p>
      <div v-if="promptKind === 'char'" class="char">{{ promptText }}</div>
      <div v-else class="prompt-box">{{ promptText }}</div>

      <div class="options" :class="optionKind === 'char' ? 'options-char' : 'options-text'">
        <button
          v-for="option in options"
          :key="String(option)"
          class="option"
          :class="optionClass(option)"
          :disabled="picked !== null"
          @click="choose(option)"
        >
          {{ formatOption(option) }}
        </button>
      </div>

      <div class="footer">
        <p v-if="picked !== null" class="feedback" :class="{ ok: isCorrect }">
          {{ isCorrect ? '答对了！' : `正确答案：${formatOption(answer)}` }}
        </p>
        <button v-if="picked !== null" class="next" @click="nextQuestion">下一题 →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { sample, shuffle } from '../../utils/random'

// 通用选择题骨架：题面（promptKind）和选项（optionKind）都可配置，
// 不同知识维度的小游戏只需作为薄包装传入取值函数即可复用本组件。
const props = defineProps({
  question: { type: String, required: true },
  pool: { type: Array, required: true },
  getPrompt: { type: Function, required: true }, // (item) => 题面文本
  getAnswer: { type: Function, required: true }, // (item) => 正确答案
  promptKind: { type: String, default: 'char' }, // 'char' 大字 | 'text' 文本框
  optionKind: { type: String, default: 'text' }, // 'char' 方块 | 'text' 文字按钮
  buildOptions: { type: Function, default: null }, // (item, answer) => 选项数组（含答案），可自定义
  formatOption: { type: Function, default: (v) => String(v) },
})

const current = ref(sample(props.pool))
const answer = ref(null) // 当题答案，建题时确定一次（getAnswer 可能含随机性）
const options = ref([])
const picked = ref(null)
const score = ref(0)
const streak = ref(0)
const bestStreak = ref(0)
const answered = ref(0)

const promptText = computed(() => props.getPrompt(current.value))
const isCorrect = computed(
  () => picked.value !== null && String(picked.value) === String(answer.value),
)

// 默认从题库中取其它条目的同字段值作为干扰项，按字符串去重。
function defaultOptions(item, ans) {
  const seen = new Set([String(ans)])
  const others = []
  for (const it of shuffle(props.pool)) {
    const v = props.getAnswer(it)
    if (!seen.has(String(v))) {
      seen.add(String(v))
      others.push(v)
    }
  }
  return shuffle([ans, ...others.slice(0, 3)])
}

function nextQuestion() {
  current.value = sample(props.pool)
  answer.value = props.getAnswer(current.value)
  options.value = (props.buildOptions || defaultOptions)(current.value, answer.value)
  picked.value = null
}

function choose(option) {
  if (picked.value !== null) {
    return
  }
  picked.value = option
  answered.value += 1
  if (String(option) === String(answer.value)) {
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
  if (String(option) === String(answer.value)) {
    return 'correct'
  }
  if (String(option) === String(picked.value)) {
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

.prompt-box {
  max-width: 620px;
  margin: 0 auto 24px;
  padding: 20px 24px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  color: #374151;
  font-size: 20px;
  line-height: 1.7;
}

.options {
  display: grid;
  gap: 14px;
  margin: 0 auto;
}

.options-text {
  grid-template-columns: repeat(2, 1fr);
  max-width: 520px;
}

.options-char {
  grid-template-columns: repeat(4, 1fr);
  max-width: 520px;
}

.option {
  border: 1px solid #d1d5db;
  border-radius: 14px;
  background: white;
  cursor: pointer;
  transition: 0.15s;
}

.options-text .option {
  padding: 16px;
  font-size: 20px;
}

.options-char .option {
  aspect-ratio: 1 / 1;
  font-size: 40px;
  font-weight: 700;
  color: #174236;
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

@media (max-width: 640px) {
  .options-char {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
