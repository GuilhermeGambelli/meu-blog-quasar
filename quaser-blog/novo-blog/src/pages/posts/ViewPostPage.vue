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
        <span>Por <strong>{{ post.autor?.nome || 'Desconhecido' }}</strong></span>
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
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const postStore = usePostStore()
const { currentPost: post, loading, error } = storeToRefs(postStore)

const postId = computed(() => route.params.id)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
}

const formattedPublicationDate = computed(() => formatDate(post.value?.dataPublicacao))
const formattedUpdateDate = computed(() => formatDate(post.value?.dataUltimaAlteracao))

onMounted(() => {
  postStore.fetchPostById(postId.value)
})
</script>

<style lang="scss" scoped>
/* ... (estilos permanecem os mesmos) ... */
</style>