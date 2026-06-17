<template>
  <QuizGame
    question="下面哪个词语里有这个字？"
    :pool="characters"
    :get-prompt="(c) => c.char"
    prompt-kind="char"
    :get-answer="getWord"
    :build-options="buildOptions"
    option-kind="text"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
import { sample, shuffle } from '../../utils/random'

// 正确答案：含该字的一个词语；干扰项：不含该字的其它词语。
function getWord(item) {
  return sample(item.words)
}

function buildOptions(item, answer) {
  const distractors = characters
    .flatMap((c) => c.words)
    .filter((w) => !w.includes(item.char))
  return shuffle([answer, ...shuffle(distractors).slice(0, 3)])
}
</script>
