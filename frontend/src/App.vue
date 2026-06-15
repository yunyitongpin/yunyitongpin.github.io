<template>
  <div class="app">
    <nav class="navbar">
      <div class="navbar-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-mark">字</span>
          <span class="brand-text">AIGC 国际中文</span>
        </RouterLink>

        <div class="nav-links">
          <RouterLink to="/">资源库</RouterLink>
          <RouterLink to="/games">小游戏</RouterLink>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: #f5f7fb;
  color: #1f2937;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.navbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #174236;
  font-weight: 700;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2f5d50, #174236);
  color: white;
  font-size: 18px;
}

.brand-text {
  font-size: 17px;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-links a {
  padding: 8px 16px;
  border-radius: 999px;
  text-decoration: none;
  color: #4b5563;
  font-size: 15px;
  transition: 0.2s;
}

.nav-links a:hover {
  background: #edf2f7;
  color: #2f5d50;
}

.nav-links a.router-link-active {
  background: #2f5d50;
  color: white;
}

@media (max-width: 640px) {
  .brand-text {
    display: none;
  }
}
</style>
