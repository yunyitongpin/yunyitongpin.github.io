<template>
  <div class="games">
    <header class="page-header">
      <div class="page-header-inner">
        <div>
          <h1>国际中文小游戏</h1>
          <p>把汉字、拼音与字源知识变成轻松有趣的互动练习</p>
        </div>
        <div class="header-stats">
          <div>
            <strong>{{ games.length }}</strong>
            <span>小游戏</span>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <!-- 游戏选择页 -->
      <section v-if="!activeGame" class="grid">
        <button v-for="game in games" :key="game.id" class="game-card" @click="open(game)">
          <span class="emoji" :style="{ background: game.color }">{{ game.emoji }}</span>
          <h3>{{ game.title }}</h3>
          <p class="subtitle">{{ game.titleEn }}</p>
          <p class="desc">{{ game.description }}</p>
          <p class="desc-en">{{ game.descriptionEn }}</p>
          <div class="tags">
            <span v-for="tag in game.tags" :key="tag">{{ tag }}</span>
          </div>
        </button>
      </section>

      <!-- 游戏进行页 -->
      <section v-else class="play">
        <div class="play-bar">
          <button class="back" @click="close">← 返回游戏列表</button>
          <h2>
            <span>{{ activeGame.emoji }}</span> {{ activeGame.title }}
            <small>{{ activeGame.titleEn }}</small>
          </h2>
        </div>

        <div class="play-stage">
          <component :is="gameComponents[activeGame.component]" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { games } from '../data/games'
import CharMatchGame from '../components/games/CharMatchGame.vue'
import PinyinQuizGame from '../components/games/PinyinQuizGame.vue'
import CharGuessGame from '../components/games/CharGuessGame.vue'
import MeaningQuizGame from '../components/games/MeaningQuizGame.vue'
import RadicalQuizGame from '../components/games/RadicalQuizGame.vue'
import StrokeQuizGame from '../components/games/StrokeQuizGame.vue'
import StructureQuizGame from '../components/games/StructureQuizGame.vue'
import HskQuizGame from '../components/games/HskQuizGame.vue'
import ReversePinyinGame from '../components/games/ReversePinyinGame.vue'
import WordQuizGame from '../components/games/WordQuizGame.vue'
import OriginQuizGame from '../components/games/OriginQuizGame.vue'
import ComponentsQuizGame from '../components/games/ComponentsQuizGame.vue'
import PinyinInputGame from '../components/games/PinyinInputGame.vue'
import MemorySequenceGame from '../components/games/MemorySequenceGame.vue'
import SpeedTapGame from '../components/games/SpeedTapGame.vue'
import TimeAttackGame from '../components/games/TimeAttackGame.vue'
import WordScrambleGame from '../components/games/WordScrambleGame.vue'
import TrueFalseGame from '../components/games/TrueFalseGame.vue'
import FlashcardGame from '../components/games/FlashcardGame.vue'
import OddOneOutGame from '../components/games/OddOneOutGame.vue'

// 注册表：游戏元信息的 component 字段映射到实际组件。
const gameComponents = {
  CharMatchGame,
  PinyinQuizGame,
  CharGuessGame,
  MeaningQuizGame,
  RadicalQuizGame,
  StrokeQuizGame,
  StructureQuizGame,
  HskQuizGame,
  ReversePinyinGame,
  WordQuizGame,
  OriginQuizGame,
  ComponentsQuizGame,
  PinyinInputGame,
  MemorySequenceGame,
  SpeedTapGame,
  TimeAttackGame,
  WordScrambleGame,
  TrueFalseGame,
  FlashcardGame,
  OddOneOutGame,
}

const activeGame = ref(null)

function open(game) {
  activeGame.value = game
}

function close() {
  activeGame.value = null
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #3b6f61, #174236);
  color: white;
  padding: 38px 24px;
}

.page-header-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.page-header h1 {
  margin: 0;
  font-size: 34px;
  letter-spacing: 1px;
}

.page-header p {
  margin: 12px 0 0;
  opacity: 0.9;
}

.header-stats div {
  min-width: 88px;
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.14);
  text-align: center;
}

.header-stats strong {
  display: block;
  font-size: 24px;
}

.header-stats span {
  font-size: 13px;
  opacity: 0.9;
}

.main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 30px 24px 50px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.game-card {
  text-align: left;
  padding: 22px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: 0.2s;
}

.game-card:hover {
  transform: translateY(-4px);
  border-color: #2f5d50;
}

.emoji {
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  font-size: 28px;
  margin-bottom: 16px;
}

.game-card h3 {
  margin: 0 0 2px;
  font-size: 18px;
}

.game-card .subtitle {
  margin: 0 0 12px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #2f5d50;
}

.game-card .desc {
  margin: 0 0 8px;
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
}

.game-card .desc-en {
  margin: 0 0 14px;
  color: #9ca3af;
  line-height: 1.55;
  font-size: 12.5px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tags span {
  padding: 4px 10px;
  border-radius: 999px;
  background: #edf2f7;
  color: #4b5563;
  font-size: 12px;
}

.play-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
}

.back {
  padding: 10px 18px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.back:hover {
  border-color: #2f5d50;
  color: #2f5d50;
}

.play-bar h2 {
  margin: 0;
  font-size: 22px;
}

.play-bar h2 small {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
}

.play-stage {
  padding: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

@media (max-width: 640px) {
  .page-header-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
