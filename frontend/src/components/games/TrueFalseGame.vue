<template>
  <div class="truefalse">
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
      <p class="prompt">下面这句话对不对？</p>
      <div class="statement">{{ question.text }}</div>

      <div class="choices">
        <button
          class="choice yes"
          :class="choiceClass(true)"
          :disabled="picked !== null"
          @click="choose(true)"
        >
          ✓ 对
        </button>
        <button
          class="choice no"
          :class="choiceClass(false)"
          :disabled="picked !== null"
          @click="choose(false)"
        >
          ✗ 错
        </button>
      </div>

      <div class="footer">
        <p v-if="picked !== null" class="feedback" :class="{ ok: correct }">
          {{ correct ? '答对了！' : question.explain }}
        </p>
        <button v-if="picked !== null" class="next" @click="nextQuestion">下一题 →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { characters } from '../../data/characters'
import { sample } from '../../utils/random'

const question = ref(makeQuestion())
const picked = ref(null)
const correct = ref(false)
const score = ref(0)
const streak = ref(0)
const answered = ref(0)

// 各属性的命题模板：返回真实陈述与一个错误值，用于生成对/错判断题。
const templates = [
  {
    field: 'radical',
    text: (c, v) => `「${c.char}」的部首是「${v}」。`,
    explain: (c) => `「${c.char}」的部首其实是「${c.radical}」。`,
  },
  {
    field: 'strokes',
    text: (c, v) => `「${c.char}」一共有 ${v} 画。`,
    explain: (c) => `「${c.char}」其实有 ${c.strokes} 画。`,
  },
  {
    field: 'structure',
    text: (c, v) => `「${c.char}」是${v}。`,
    explain: (c) => `「${c.char}」其实是${c.structure}。`,
  },
  {
    field: 'pinyin',
    text: (c, v) => `「${c.char}」的拼音是「${v}」。`,
    explain: (c) => `「${c.char}」的拼音其实是「${c.pinyin}」。`,
  },
]

function makeQuestion() {
  const c = sample(characters)
  const template = sample(templates)
  const isTrue = Math.random() < 0.5
  let value = c[template.field]
  if (!isTrue) {
    // 从其它汉字里取一个不同的值作为错误陈述。
    const pool = characters
      .map((item) => item[template.field])
      .filter((v) => String(v) !== String(c[template.field]))
    value = sample(pool)
  }
  return {
    text: template.text(c, value),
    truth: isTrue,
    explain: template.explain(c),
  }
}

function choose(value) {
  if (picked.value !== null) {
    return
  }
  picked.value = value
  answered.value += 1
  correct.value = value === question.value.truth
  if (correct.value) {
    score.value += 10
    streak.value += 1
  } else {
    streak.value = 0
  }
}

function choiceClass(value) {
  if (picked.value === null) {
    return ''
  }
  if (value === question.value.truth) {
    return 'correct'
  }
  if (value === picked.value) {
    return 'wrong'
  }
  return 'dimmed'
}

function nextQuestion() {
  question.value = makeQuestion()
  picked.value = null
  correct.value = false
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

.statement {
  max-width: 560px;
  margin: 0 auto 26px;
  padding: 24px;
  border-radius: 16px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  font-size: 24px;
  color: #174236;
}

.choices {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 460px;
  margin: 0 auto;
}

.choice {
  padding: 20px;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  background: white;
  font-size: 22px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.15s;
}

.choice:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: #2f5d50;
}

.choice.correct {
  background: #dcfce7;
  border-color: #16a34a;
  color: #166534;
}

.choice.wrong {
  background: #fee2e2;
  border-color: #dc2626;
  color: #991b1b;
}

.choice.dimmed {
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
</style>
