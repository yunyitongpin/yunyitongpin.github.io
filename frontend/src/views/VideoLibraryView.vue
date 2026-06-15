<template>
  <div class="library">
    <header class="page-header">
      <div class="page-header-inner">
        <div>
          <h1>AIGC 国际中文短视频教学资源库</h1>
          <p>面向汉字、词语与文化点的 AIGC 脚本、分镜、短视频和教学任务管理平台</p>
        </div>

        <div class="header-stats">
          <div>
            <strong>{{ lessons.length }}</strong>
            <span>短视频</span>
          </div>
          <div>
            <strong>{{ totalKeywords }}</strong>
            <span>关键词</span>
          </div>
          <div>
            <strong>{{ totalTasks }}</strong>
            <span>教学任务</span>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <section class="toolbar">
        <div>
          <h2>短视频资源检索</h2>
          <p>可按汉字、词语、标题、等级、AIGC 工具或关键词搜索</p>
        </div>

        <input v-model="keyword" type="text" placeholder="例如：明、休、你好、初级、数字人" />
      </section>

      <section class="layout">
        <aside class="left-panel">
          <VideoLessonCard
            v-for="item in filteredLessons"
            :key="item.id"
            :lesson="item"
            :is-active="selectedLesson?.id === item.id"
            @select="selectLesson"
          />

          <div v-if="filteredLessons.length === 0" class="no-result">没有找到相关短视频资源</div>
        </aside>

        <VideoLessonDetail :lesson="selectedLesson" />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { videoLessons } from '../data/videoLessons'
import VideoLessonCard from '../components/VideoLessonCard.vue'
import VideoLessonDetail from '../components/VideoLessonDetail.vue'

const keyword = ref('')
const lessons = ref(videoLessons)
const selectedLesson = ref(videoLessons[0])

const filteredLessons = computed(() => {
  const value = keyword.value.trim().toLowerCase()

  if (!value) {
    return lessons.value
  }

  return lessons.value.filter((item) => {
    return (
      item.title.includes(value) ||
      item.targetText.includes(value) ||
      item.type.includes(value) ||
      item.level.includes(value) ||
      item.aiTool.toLowerCase().includes(value) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(value))
    )
  })
})

const totalKeywords = computed(() => {
  const list = lessons.value.flatMap((item) => item.keywords)
  return new Set(list).size
})

const totalTasks = computed(() => {
  return lessons.value.reduce((total, item) => total + item.tasks.length, 0)
})

function selectLesson(item) {
  selectedLesson.value = item
}
</script>

<style scoped>
.page-header {
  background: linear-gradient(135deg, #2f5d50, #174236);
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

.header-stats {
  display: flex;
  gap: 14px;
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

.toolbar {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 24px;
}

.toolbar h2 {
  margin: 0 0 6px;
}

.toolbar p {
  margin: 0;
  color: #6b7280;
}

.toolbar input {
  width: 420px;
  max-width: 100%;
  padding: 14px 16px;
  border: 1px solid #d1d5db;
  border-radius: 14px;
  font-size: 15px;
  outline: none;
}

.toolbar input:focus {
  border-color: #2f5d50;
  box-shadow: 0 0 0 3px rgba(47, 93, 80, 0.12);
}

.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

.left-panel {
  display: grid;
  gap: 16px;
}

.no-result {
  padding: 24px;
  background: white;
  border-radius: 18px;
  color: #6b7280;
  text-align: center;
}

@media (max-width: 900px) {
  .page-header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar input {
    width: 100%;
  }

  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
