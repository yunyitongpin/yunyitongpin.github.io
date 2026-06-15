<template>
  <button class="video-card" :class="{ active: isActive }" @click="$emit('select', lesson)">
    <img :src="lesson.cover" :alt="lesson.title" />

    <div class="content">
      <div class="top-line">
        <span>{{ lesson.type }}</span>
        <span>{{ lesson.duration }}</span>
      </div>

      <h3>{{ lesson.title }}</h3>

      <p class="target">教学对象：{{ lesson.targetText }}</p>

      <div class="tags">
        <span>{{ lesson.level }}</span>
        <span>{{ lesson.aiTool }}</span>
      </div>
    </div>
  </button>
</template>

<script setup>
defineProps({
  lesson: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>

<style scoped>
.video-card {
  width: 100%;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: white;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: 0.2s;
}

.video-card:hover {
  transform: translateY(-3px);
  border-color: #2f5d50;
}

.video-card.active {
  border-color: #2f5d50;
  background: #f0f7f4;
}

.video-card img {
  width: 100%;
  display: block;
}

.content {
  padding: 14px;
}

.top-line {
  display: flex;
  justify-content: space-between;
  color: #6b7280;
  font-size: 12px;
}

h3 {
  margin: 10px 0;
  font-size: 17px;
  line-height: 1.4;
}

.target {
  margin: 0 0 10px;
  color: #374151;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tags span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #edf2f7;
  color: #4b5563;
  font-size: 12px;
}
</style>
