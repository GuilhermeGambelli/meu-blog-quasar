<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4">Blog Posts</h1>
      <q-btn
        label="Novo Post"
        color="primary"
        icon="add"
        @click="router.push('/posts/novo')"
      />
    </div>

    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h6">Filtros</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-select
              v-model="filters.categoria"
              :options="['Tecnologia', 'Notícias', 'Esportes', 'Cultura', 'Viagem', 'Testes']"
              label="Filtrar por Categoria"
              outlined
              dense
              clearable
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="filters.autorId"
              :options="autorOptions"
              label="Filtrar por Autor"
              outlined
              dense
              clearable
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input outlined dense v-model="filters.dataPublicacao_gte" label="Filtrar a partir de" clearable>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.dataPublicacao_gte" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Limpar Filtros" color="grey-7" flat @click="clearFilters" />
      </q-card-actions>
    </q-card>

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <div v-else-if="error" class="text-negative text-center q-my-md">{{ error }}</div>

    <div v-else-if="posts.length > 0" class="posts-grid">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @delete="handleDeletePost"
      />
    </div>

    <div v-else class="text-center text-grey-7 q-my-xl">
      <q-icon name="search" size="lg" />
      <p class="text-h6 q-mt-md">Nenhum post encontrado</p>
      <p>Tente ajustar ou limpar os filtros.</p>
    </div>

    <div v-if="!loading && posts.length > 0 && pagination.totalPages > 1" class="flex flex-center q-mt-lg">
      <q-pagination
        v-model="pagination.page"
        :max="pagination.totalPages"
        :max-pages="6"
        direction-links
        boundary-numbers
        icon-prev="eva-arrow-ios-back"
        icon-next="eva-arrow-ios-forward"
        color="primary"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from 'src/stores/post-store'
import { useAutorStore } from 'src/stores/autor-store'
import PostCard from 'src/components/posts/PostCard.vue'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// Instanciando as stores Pinia
const postStore = usePostStore()
const autorStore = useAutorStore()

// Usando storeToRefs para manter a reatividade sem precisar de `computed()` para cada propriedade
const { posts, loading, error, totalPosts } = storeToRefs(postStore)
const { allAutores: autores } = storeToRefs(autorStore)

// Computeds
const autorOptions = computed(() => autores.value.map(autor => ({
  label: autor.nome,
  value: autor.id
})))

const pagination = ref({
  page: 1,
  rowsPerPage: 9,
  totalPages: computed(() => Math.ceil(totalPosts.value / pagination.value.rowsPerPage))
})

const filters = ref({
  categoria: '',
  autorId: '',
  dataPublicacao_gte: ''
})

const applyFiltersAndPagination = () => {
  const params = {
    ...filters.value,
    _page: pagination.value.page,
    _limit: pagination.value.rowsPerPage,
    _sort: 'dataPublicacao',
    _order: 'desc'
  }
  postStore.fetchPosts(params)
}

const clearFilters = () => {
  filters.value = { categoria: '', autorId: '', dataPublicacao_gte: '' }
}

watch(filters, () => {
  pagination.value.page = 1
  applyFiltersAndPagination()
}, { deep: true })

watch(() => pagination.value.page, applyFiltersAndPagination)

onMounted(() => {
  applyFiltersAndPagination()
  autorStore.fetchAutores()
})

async function handleDeletePost(postId) {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja deletar este post?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Deletar', color: 'negative' }
  }).onOk(async () => {
    await postStore.deletePost(postId)
    $q.notify({ type: 'positive', message: 'Post deletado com sucesso!' })
    applyFiltersAndPagination()
  })
}
</script>

<style lang="scss" scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
</style>