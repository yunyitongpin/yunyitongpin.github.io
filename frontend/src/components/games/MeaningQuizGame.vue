<template>
  <QuizGame
    question="下面这个汉字的意思是？"
    :pool="characters"
    :get-prompt="(c) => c.char"
    prompt-kind="char"
    :get-answer="(c) => c.meaning"
    option-kind="text"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
</script>
