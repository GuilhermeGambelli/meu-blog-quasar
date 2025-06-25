<template>
  <div class="post-card" @click="viewPost">
    <q-img
      class="post-card__image"
      :src="post.imagem"
      :ratio="16/9"
      spinner-color="primary"
    >
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          Não foi possível carregar a imagem
        </div>
      </template>
    </q-img>

    <div class="post-card__content">
      <div class="post-card__header">
        <h3 class="post-card__title">{{ post.titulo }}</h3>
        <q-chip
          dense
          color="primary"
          text-color="white"
          class="post-card__category"
        >
          {{ post.categoria }}
        </q-chip>
      </div>

      <p class="post-card__description">{{ post.pequenaDescricao }}</p>

      <div class="post-card__meta">
        <div class="post-card__author">
          <q-icon name="person" class="q-mr-xs" />
          <span>{{ authorName }}</span>
        </div>
        <div class="post-card__date">
          <q-icon name="event" class="q-mr-xs" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <div class="post-card__actions">
      <q-btn flat dense round icon="visibility" color="grey-8" @click.stop="viewPost" aria-label="Visualizar Post" />
      <q-btn flat dense round icon="edit" color="blue-8" @click.stop="editPost" aria-label="Editar Post" />
      <q-btn flat dense round icon="delete" color="red-8" @click.stop="deletePost" aria-label="Deletar Post" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAutorStore } from 'src/stores/autor-store'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['delete'])
const router = useRouter()

const autorStore = useAutorStore()
const { allAutores: autores } = storeToRefs(autorStore)

const authorName = computed(() => {
  if (!props.post || !props.post.autorId) {
    return 'Autor Desconhecido'
  }
  const autor = autores.value.find(a => a.id === props.post.autorId)
  return autor ? autor.nome : 'Autor Desconhecido'
})

const formattedDate = computed(() => {
  if (!props.post.dataPublicacao) return ''
  return new Date(props.post.dataPublicacao).toLocaleDateString('pt-BR')
})

function viewPost () {
  router.push(`/posts/${props.post.id}`)
}

function editPost () {
  router.push(`/posts/${props.post.id}/editar`)
}

function deletePost () {
  emit('delete', props.post.id)
}
</script>

<style lang="scss" scoped>
.post-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  height: 100%;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  &__image {}

  &__content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
    margin-right: 8px;
  }

  &__category {
    flex-shrink: 0;
  }

  &__description {
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 16px 0;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #777;
    border-top: 1px solid #f0f0f0;
    padding-top: 12px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 8px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>