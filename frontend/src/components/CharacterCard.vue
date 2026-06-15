<template>
  <button class="char-card" :class="{ active: isActive }" @click="$emit('select', character)">
    <div class="char-main">{{ character.char }}</div>

    <div class="char-meta">
      <span>{{ character.pinyin }}</span>
      <span>{{ character.structure }}</span>
    </div>

    <div class="char-tags">
      <span>HSK {{ character.hskLevel }}</span>
      <span>{{ character.strokes }} 画</span>
    </div>
  </button>
</template>

<script setup>
defineProps({
  character: {
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
.char-card {
  width: 100%;
  padding: 18px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition: 0.2s;
}

.char-card:hover {
  transform: translateY(-3px);
  border-color: #2f5d50;
}

.char-card.active {
  border-color: #2f5d50;
  background: #f0f7f4;
}

.char-main {
  font-size: 58px;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 12px;
}

.char-meta {
  display: flex;
  justify-content: space-between;
  color: #374151;
  font-size: 14px;
  margin-bottom: 10px;
}

.char-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.char-tags span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #edf2f7;
  color: #4b5563;
  font-size: 12px;
}
</style>
