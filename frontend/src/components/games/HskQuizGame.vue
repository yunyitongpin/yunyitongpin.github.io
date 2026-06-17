<template>
  <QuizGame
    question="下面这个汉字属于哪个 HSK 等级？"
    :pool="characters"
    :get-prompt="(c) => c.char"
    prompt-kind="char"
    :get-answer="(c) => c.hskLevel"
    :build-options="buildOptions"
    :format-option="(v) => `HSK ${v}`"
    option-kind="text"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
import { shuffle } from '../../utils/random'

// HSK 等级范围有限（1–6），在正确答案附近取相邻等级作为干扰项。
function buildOptions(item, answer) {
  const set = new Set([answer])
  let delta = 1
  while (set.size < 4) {
    if (answer - delta >= 1) {
      set.add(answer - delta)
    }
    if (set.size < 4 && answer + delta <= 6) {
      set.add(answer + delta)
    }
    delta += 1
    if (delta > 6) {
      break
    }
  }
  return shuffle([...set])
}
</script>
