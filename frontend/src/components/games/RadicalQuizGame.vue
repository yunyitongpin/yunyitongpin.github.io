<template>
  <QuizGame
    question="下面这个汉字的部首是？"
    :pool="characters"
    :get-prompt="(c) => c.char"
    prompt-kind="char"
    :get-answer="(c) => c.radical"
    option-kind="char"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
</script>
