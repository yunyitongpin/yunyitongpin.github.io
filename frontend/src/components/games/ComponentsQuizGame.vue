<template>
  <QuizGame
    question="下面这些部件能组成哪个汉字？"
    :pool="characters"
    :get-prompt="(c) => c.components.join('  ＋  ')"
    prompt-kind="text"
    :get-answer="(c) => c.char"
    option-kind="char"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
</script>
