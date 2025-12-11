<script setup lang="ts">
import type { Icon, Tags, Togo, View } from '../../view'
import VPImage from '@vitepress-components/VPImage.vue'
import VPLink from '@vitepress-components/VPLink.vue'
import { collectionStatMap } from 'virtual:views'
import { useRouter, withBase } from 'vitepress'
import { useTheme } from '../composables/theme'

const props = withDefaults(defineProps<{ view: View, inFavorite?: boolean }>(), { inFavorite: false })
const theme = useTheme()
const router = useRouter()
const icon = computed(() => (props.view as Partial<Icon>).icon)
const tags = computed(() => (props.view as Partial<Tags>).tags)
const togo = computed(() => (props.view as Partial<Togo>).togo)
const stat = computed(() => collectionStatMap[props.view.id])

function handleTagClick(tag: string) {
  router.go(withBase(`/tags?tag=${encodeURIComponent(tag)}`))
}
</script>

<template>
  <VPLink class="RViewCard" :no-icon="true" :href="view.pathname" @click.prevent>
    <article class="box">
      <div v-if="icon" class="header">
        <VPImage :image="icon" style="width: 48px; height: 48px; object-fit: contain;" />
        <RFavorite :view="view" />
      </div>
      <h2 v-if="!inFavorite" v-html="view.title" />
      <h2 v-else>
        <RBreadcrumbs :view="view" :disabled-click="true" />
      </h2>
      <RTags v-if="tags" :tags="tags" @tag-click="handleTagClick" />
      <p v-if="view.description" class="description" v-html="view.description" />
      <div class="grow" />
      <div class="actions">
        <VPLink v-if="togo" class="action link" :href="togo" :no-icon="true" tag="a" @click.stop>
          {{ theme.view.collection.gotoLabel }} <RIcon name="chevrons-right" size="1.5em" />
        </VPLink>
        <template v-if="view.layout === 'collection'">
          <span v-if="stat.collectionCount > 0" class="action">
            {{ theme.viewCard.collectionCountLabel }} {{ stat.collectionCount }}
          </span>
          <span v-if="stat.articleCount > 0" class="action">
            {{ theme.viewCard.articleCountLabel }} {{ stat.articleCount }}
          </span>
          <span v-if="stat.resourceCount > 0" class="action">
            {{ theme.viewCard.resourceCountLabel }} {{ stat.resourceCount }}
          </span>
        </template>
      </div>
    </article>
  </VPLink>
</template>

<style scoped>
.RViewCard {
  display: block;
  border-radius: 8px;
  height: 100%;
  transition: border-color 0.25s, background-color 0.25s;
  cursor: pointer;
  background: var(--vp-c-bg);
}

.RViewCard:hover {
  border-color: var(--vp-c-brand-3);
}

.RViewCard .box .header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.RViewCard .box h2 {
  margin: 0 0 0px !important;
  padding: 8px 0 !important;
  border-top: none !important;
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
}

.RViewCard .box h2 ::v-deep(.RBreadcrumbs) {
  margin: 0 !important;
}

.RViewCard .box p {
  margin: 0 !important;
  padding-top: 8px;
}

.box {
  display: flex;
  flex-direction: column;
  padding: 18px;
  height: 100%;
}

.box> :deep(.VPImage) {
  margin-bottom: .45rem;
}

.description {
  flex-grow: 1;
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.grow {
  flex-grow: 1;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.actions .action {
  opacity: 0.5;
  margin-left: 8px;
  font-size: .8em;
}

.actions .action.link:hover {
  opacity: 1;
}

.actions .action.link {
  display: flex;
  align-items: center;
}
</style>
