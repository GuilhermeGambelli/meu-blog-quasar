<template>
  <div class="post-card">
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
          <span>{{ post.autor?.nome || 'Autor Desconhecido' }}</span>
        </div>
        <div class="post-card__date">
          <q-icon name="event" class="q-mr-xs" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>
    </div>

    <div class="post-card__actions">
      <q-btn flat dense round icon="visibility" color="grey-8" @click="viewPost" aria-label="Visualizar Post" />
      <q-btn flat dense round icon="edit" color="blue-8" @click="editPost" aria-label="Editar Post" />
      <q-btn flat dense round icon="delete" color="red-8" @click="deletePost" aria-label="Deletar Post" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

// 1. Definindo as propriedades (props) que o componente espera receber
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

// 2. Definindo os eventos (emits) que o componente pode disparar para o pai
const emit = defineEmits(['delete'])
const router = useRouter()

// 3. Computeds para formatar dados
const formattedDate = computed(() => {
  if (!props.post.dataPublicacao) return ''
  return new Date(props.post.dataPublicacao).toLocaleDateString('pt-BR')
})

// 4. Métodos para manipular ações
function viewPost () {
  router.push(`/posts/${props.post.id}`)
}

function editPost () {
  router.push(`/posts/${props.post.id}/editar`)
}

function deletePost () {
  // Dispara o evento 'delete' para o componente pai, passando o ID do post
  emit('delete', props.post.id)
}
</script>

<style lang="scss" scoped>
.post-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Garante que a imagem com borda arredondada se ajuste */
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  height: 100%; /* Garante que todos os cards na grade tenham a mesma altura */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  &__image {
    // A q-img já cuida da imagem, sem necessidade de muito estilo aqui
  }

  &__content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Faz esta área crescer para preencher o espaço */
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
    margin-right: 8px; // Espaço para o chip não colar
  }

  &__category {
    flex-shrink: 0; // Impede que o chip encolha
  }

  &__description {
    font-size: 0.9rem;
    color: #555;
    margin: 0 0 16px 0;
    flex-grow: 1; /* Ocupa o espaço disponível, empurrando os metadados para baixo */

    // Efeito de ellipsis (...)
    display: -webkit-box;
    -webkit-line-clamp: 3; // Limita a 3 linhas
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

  &__author,
  &__date {
    display: flex;
    align-items: center;
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