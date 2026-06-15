<template>
  <section v-if="lesson" class="detail-panel">
    <div class="video-box">
      <div v-if="lesson.videoUrl" class="video-player">
        <video controls :src="lesson.videoUrl"></video>
      </div>

      <div v-else class="video-placeholder">
        <div class="play-icon">▶</div>
        <p>这里将展示 AIGC 生成后的短视频</p>
      </div>
    </div>

    <div class="detail-header">
      <div class="target-text">{{ lesson.targetText }}</div>

      <div>
        <h2>{{ lesson.title }}</h2>
        <p>{{ lesson.type }} ｜ {{ lesson.level }} ｜ {{ lesson.duration }}</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-box">
        <h3>教学目标</h3>
        <p>{{ lesson.teachingGoal }}</p>
      </div>

      <div class="info-box">
        <h3>AIGC 工具定位</h3>
        <p>{{ lesson.aiTool }}</p>
      </div>
    </div>

    <div class="section">
      <h3>AIGC 视频脚本</h3>
      <ol>
        <li v-for="item in lesson.script" :key="item">
          {{ item }}
        </li>
      </ol>
    </div>

    <div class="section">
      <h3>生成提示词 Prompt</h3>
      <p class="prompt">{{ lesson.prompt }}</p>
    </div>

    <div class="section">
      <h3>课后任务</h3>
      <ul>
        <li v-for="task in lesson.tasks" :key="task">
          {{ task }}
        </li>
      </ul>
    </div>

    <div class="section">
      <h3>关键词</h3>
      <div class="tag-list">
        <span v-for="item in lesson.keywords" :key="item">
          {{ item }}
        </span>
      </div>
    </div>
  </section>

  <section v-else class="empty-panel">
    <h2>请选择一个短视频教学资源</h2>
    <p>点击左侧卡片后，这里会显示脚本、提示词、教学目标和课后任务。</p>
  </section>
</template>

<script setup>
defineProps({
  lesson: {
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

.video-box {
  margin-bottom: 24px;
}

.video-player video {
  width: 100%;
  border-radius: 18px;
}

.video-placeholder {
  height: 280px;
  border-radius: 18px;
  background: linear-gradient(135deg, #2f5d50, #174236);
  color: white;
  display: grid;
  place-items: center;
  text-align: center;
}

.play-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 30px;
  margin-bottom: 12px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.target-text {
  width: 90px;
  height: 90px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: #f0f7f4;
  color: #2f5d50;
  font-size: 54px;
  font-weight: 700;
}

.detail-header h2 {
  margin: 0 0 8px;
}

.detail-header p {
  margin: 0;
  color: #6b7280;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 24px;
}

.info-box {
  background: #f8fafc;
  border-radius: 16px;
  padding: 18px;
}

.info-box h3,
.section h3 {
  margin-top: 0;
}

.info-box p,
.section li {
  line-height: 1.8;
}

.section {
  margin-top: 24px;
}

.prompt {
  background: #f8fafc;
  border-left: 4px solid #2f5d50;
  padding: 16px;
  border-radius: 12px;
  line-height: 1.8;
}

.tag-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-list span {
  padding: 8px 14px;
  border-radius: 999px;
  background: #edf2f7;
  color: #374151;
}

@media (max-width: 800px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
