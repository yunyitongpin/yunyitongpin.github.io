<template>
  <QuizGame
    question="根据下面的字源描述，猜猜是哪个汉字？"
    :pool="characters"
    :get-prompt="(c) => c.origin"
    prompt-kind="text"
    :get-answer="(c) => c.char"
    option-kind="char"
  />
</template>

<script setup>
import QuizGame from './QuizGame.vue'
import { characters } from '../../data/characters'
</script>
