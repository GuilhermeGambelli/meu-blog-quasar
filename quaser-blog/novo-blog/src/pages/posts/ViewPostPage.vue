<template>
  <q-page padding>
    <div v-if="loading" class="fullscreen flex flex-center">
      <q-spinner-dots color="primary" size="xl" />
    </div>

    <div v-else-if="error || !post" class="text-center q-mt-xl">
      <q-icon name="error_outline" size="lg" color="negative" />
      <p class="text-h6 q-mt-md">Post não encontrado</p>
      <p>{{ error }}</p>
      <q-btn label="Voltar para a lista" color="primary" @click="router.push('/posts')" />
    </div>

    <div v-else class="post-view">
      <div class="post-view__header">
        <h1 class="post-view__title" :class="$q.screen.lt.sm ? 'text-h4' : 'text-h3'">
          {{ post.titulo }}
        </h1>
        <q-chip color="primary" text-color="white">{{ post.categoria }}</q-chip>
      </div>

      <div class="post-view__meta q-mb-md">
        <span>Por <strong>{{ authorName }}</strong></span>
        <q-separator vertical spaced />
        <span>Publicado em: {{ formattedPublicationDate }}</span>
        <q-separator vertical spaced />
        <span>Última atualização: {{ formattedUpdateDate }}</span>
      </div>

      <q-img
        :src="post.imagem"
        class="post-view__image q-mb-lg"
        :ratio="16/9"
        spinner-color="primary"
      />

      <div class="post-view__content" v-html="post.conteudo"></div>

      <q-separator class="q-my-xl" />
      <div class="flex items-center q-gutter-md">
        <q-btn label="Voltar para a Lista" icon="arrow_back" @click="router.push('/posts')" color="grey-8" />
        <q-btn label="Editar este Post" icon="edit" @click="router.push(`/posts/${post.id}/editar`)" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from 'src/stores/post-store'
import { useAutorStore } from 'src/stores/autor-store'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const postStore = usePostStore()
const autorStore = useAutorStore()

const { currentPost: post, loading, error } = storeToRefs(postStore)
const { allAutores: autores } = storeToRefs(autorStore)

const postId = computed(() => route.params.id)

const authorName = computed(() => {
  if (!post.value || !post.value.autorId) {
    return 'Desconhecido'
  }
  const autor = autores.value.find(a => a.id === post.value.autorId)
  return autor ? autor.nome : 'Desconhecido'
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const formattedPublicationDate = computed(() => formatDate(post.value?.dataPublicacao))
const formattedUpdateDate = computed(() => formatDate(post.value?.dataUltimaAlteracao))

onMounted(() => {
  postStore.fetchPostById(postId.value)
  autorStore.fetchAutores()
})
</script>

<style lang="scss" scoped>
.post-view {
  max-width: 900px;
  margin: 0 auto;
}
.post-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
}
.post-view__title {
  margin: 0;
  line-height: 1.1;
}
.post-view__meta {
  font-size: 0.9rem;
  color: #777;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.post-view__image {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.post-view__content {
  font-size: 1.1rem;
  line-height: 1.7;
  :deep(p) { margin-bottom: 1rem; }
  :deep(h2) { font-size: 1.8rem; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; }
  :deep(h3) { font-size: 1.5rem; margin-top: 1.8rem; margin-bottom: 1rem; }
  :deep(a) { color: $primary; text-decoration: none; &:hover { text-decoration: underline; } }
  :deep(blockquote) { border-left: 4px solid $primary; padding-left: 1rem; margin-left: 0; font-style: italic; color: #666; }
  :deep(ul), :deep(ol) { padding-left: 2rem; }
}
@media (max-width: 600px) {
  .post-view__header {
    flex-direction: column;
    align-items: stretch;
  }
  .post-view__header .q-chip {
    align-self: flex-start;
  }
  .post-view__meta {
    font-size: 0.8rem;
  }
}
</style>