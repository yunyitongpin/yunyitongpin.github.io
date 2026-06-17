<template>
  <QuizGame
    question="下面这个拼音对应哪个汉字？"
    :pool="characters"
    :get-prompt="(c) => c.pinyin"
    prompt-kind="text"
    :get-answer="(c) => c.char"
    option-kind="char"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
</script>
