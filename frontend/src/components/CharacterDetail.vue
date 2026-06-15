<template>
  <section v-if="character" class="detail-panel">
    <div class="detail-header">
      <div class="big-char">{{ character.char }}</div>

      <div>
        <h2>{{ character.char }} 的教学资源</h2>
        <p>{{ character.pinyin }} ｜ {{ character.structure }} ｜ {{ character.strokes }} 画</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h3>基本释义</h3>
        <p>{{ character.meaning }}</p>
      </div>

      <div class="info-box">
        <h3>字源说明</h3>
        <p>{{ character.origin }}</p>
      </div>
    </div>

    <div class="section">
      <h3>部件构成</h3>
      <div class="tag-list">
        <span v-for="item in character.components" :key="item">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="section">
      <h3>常用词语</h3>
      <div class="tag-list">
        <span v-for="word in character.words" :key="word">
          {{ word }}
        </span>
      </div>
    </div>

    <div class="section">
      <h3>字形演变</h3>
      <ol class="timeline">
        <li v-for="item in character.formEvolution" :key="item">
          {{ item }}
        </li>
      </ol>
    </div>

    <div class="section">
      <h3>教学建议</h3>
      <ul class="teaching-list">
        <li v-for="item in character.teaching" :key="item">
          {{ item }}
        </li>
      </ul>
    </div>
  </section>

  <section v-else class="empty-panel">
    <h2>请选择一个汉字</h2>
    <p>点击左侧汉字卡片后，这里会显示字源、部件、词语和教学建议。</p>
  </section>
</template>

<script setup>
defineProps({
  character: {
    type: Object,
    default: null,
  },
})
</script>

<style scoped>
.detail-panel,
.empty-panel {
  background: white;
  border-radius: 22px;
  padding: 28px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.big-char {
  width: 110px;
  height: 110px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  background: #2f5d50;
  color: white;
  font-size: 70px;
  font-weight: 700;
}

.detail-header h2 {
  margin: 0 0 8px;
  font-size: 26px;
}

.detail-header p {
  margin: 0;
  color: #6b7280;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 24px;
}

.info-box {
  background: #f8fafc;
  border-radius: 16px;
  padding: 18px;
}

.info-box h3,
.section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #1f2937;
}

.info-box p {
  line-height: 1.8;
  margin: 0;
}

.section {
  margin-top: 24px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-list span {
  padding: 8px 14px;
  border-radius: 999px;
  background: #edf2f7;
  color: #374151;
}

.timeline,
.teaching-list {
  margin: 0;
  padding-left: 22px;
  line-height: 1.9;
}

.empty-panel {
  color: #4b5563;
}

@media (max-width: 800px) {
  .detail-header {
    align-items: flex-start;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .big-char {
    width: 88px;
    height: 88px;
    font-size: 56px;
  }
}
</style>
