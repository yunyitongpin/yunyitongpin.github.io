<template>
  <QuizGame
    question="下面这个汉字有几画？"
    :pool="characters"
    :get-prompt="(c) => c.char"
    prompt-kind="char"
    :get-answer="(c) => c.strokes"
    :build-options="buildOptions"
    :format-option="(v) => `${v} 画`"
    option-kind="text"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
import { shuffle } from '../../utils/random'

// 笔画数取值少，直接在正确答案附近生成相近数字作为干扰项。
function buildOptions(item, answer) {
  const set = new Set([answer])
  let delta = 1
  while (set.size < 4) {
    if (answer - delta > 0) {
      set.add(answer - delta)
    }
    if (set.size < 4) {
      set.add(answer + delta)
    }
    delta += 1
  }
  return shuffle([...set])
}
</script>
