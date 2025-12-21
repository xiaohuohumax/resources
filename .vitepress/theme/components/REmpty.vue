<script lang="ts" setup>
import VPDocFooter from '@vitepress-components/VPDocFooter.vue'
</script>

<template>
  <div class="REmpty">
    <div class="container">
      <div class="content">
        <main class="main vp-doc">
          <slot />
        </main>
        <slot name="doc-after" />
        <VPDocFooter />
      </div>
    </div>
  </div>
</template>

<style scoped>
.REmpty {
  padding: 32px 24px 0;
  width: 100%;
}

.REmpty .container,
.REmpty .content {
  max-width: 1152px;
}

.REmpty>.container>.content {
  padding: 0px;
  border: none;
}

@media (min-width: 768px) {
  .REmpty {
    padding: 32px 32px 0;
  }
}

@media (min-width: 960px) {
  .REmpty {
    padding: 48px 32px 0;
    margin-bottom: 32px;
  }

  .REmpty .container {
    display: flex;
    justify-content: center;
  }

}

@media (min-width: 1280px) {
  .REmpty .container {
    display: flex;
    justify-content: center;
  }

}

.container {
  margin: 0 auto;
  width: 100%;
}

.content {
  position: relative;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .content {
    padding: 0 32px 128px;
  }
}

@media (min-width: 1280px) {
  .content {
    order: 1;
    margin: 0;
  }
}
</style>
