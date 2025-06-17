<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4">Posts</h1>
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
              :options="categoryOptions"
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
            <q-input outlined dense v-model="formattedDateRange" label="Filtrar por período" readonly class="cursor-pointer">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.dateRange" range>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
                <q-icon v-if="filters.dateRange" name="cancel" @click.stop.prevent="filters.dateRange = null" class="cursor-pointer" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Limpar Todos os Filtros" color="grey-7" flat @click="clearFilters" />
      </q-card-actions>
    </q-card>

    <div v-if="loading" class="flex flex-center q-my-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>
    <div v-else-if="error" class="text-negative text-center q-my-md">{{ error }}</div>

    <div v-else-if="paginatedPosts.length > 0" class="posts-grid">
      <PostCard
        v-for="post in paginatedPosts"
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

    <div v-if="!loading && filteredPosts.length > 0 && pagination.totalPages > 1" class="flex flex-center q-mt-lg">
      <q-pagination
        v-model="pagination.page"
        :max="pagination.totalPages"
        :max-pages="6"
        direction-links
        boundary-numbers
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
import { useCategoryStore } from 'src/stores/categoria-store'
import PostCard from 'src/components/posts/PostCard.vue'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const postStore = usePostStore()
const autorStore = useAutorStore()
const categoryStore = useCategoryStore()

const { posts, loading, error } = storeToRefs(postStore)
const { allAutores: autores } = storeToRefs(autorStore)
const { allCategories: categories } = storeToRefs(categoryStore)

const autorOptions = computed(() => autores.value.map(autor => ({ label: autor.nome, value: autor.id })))
const categoryOptions = computed(() => categories.value.map(cat => cat.nome))

const filters = ref({
  categoria: '',
  autorId: '',
  dateRange: null
})

// NOVA LÓGICA DE FILTRAGEM DE DATA (NO CLIENTE)
const filteredPosts = computed(() => {
  let items = posts.value

  // Se não houver filtro de data, retorna a lista completa da store
  if (!filters.value.dateRange) {
    return items
  }

  // Define as datas de início e fim do período selecionado
  const fromStr = typeof filters.value.dateRange === 'string' ? filters.value.dateRange : filters.value.dateRange.from
  const toStr = typeof filters.value.dateRange === 'string' ? filters.value.dateRange : filters.value.dateRange.to

  // Constrói as datas de forma segura para evitar problemas de fuso horário
  const startDate = new Date(`${fromStr.replace(/\//g, '-')}T00:00:00.000Z`)
  const endDate = new Date(`${toStr.replace(/\//g, '-')}T23:59:59.999Z`)

  // Filtra o array 'posts' usando JavaScript
  return items.filter(post => {
    const postDate = new Date(post.dataPublicacao)
    return postDate >= startDate && postDate <= endDate
  })
})

// NOVA LÓGICA DE PAGINAÇÃO (NO CLIENTE)
const pagination = ref({
  page: 1,
  rowsPerPage: 9,
  totalPages: computed(() => Math.ceil(filteredPosts.value.length / pagination.value.rowsPerPage))
})

const paginatedPosts = computed(() => {
  const startIndex = (pagination.value.page - 1) * pagination.value.rowsPerPage
  const endIndex = startIndex + pagination.value.rowsPerPage
  return filteredPosts.value.slice(startIndex, endIndex)
})

// FUNÇÃO DE BUSCA NA API (SIMPLIFICADA)
const fetchData = () => {
  // Envia apenas os filtros que o servidor suporta
  const params = {
    categoria: filters.value.categoria,
    autorId: filters.value.autorId,
    _sort: 'dataPublicacao',
    _order: 'desc',
    _expand: 'autor'
  }
  // Não envia mais paginação para a API, pois faremos no cliente
  postStore.fetchPosts(params)
}

const clearFilters = () => {
  filters.value = { categoria: '', autorId: '', dateRange: null }
}

// Watchers
watch([() => filters.value.categoria, () => filters.value.autorId], () => {
  pagination.value.page = 1
  fetchData()
})

watch(() => filters.value.dateRange, () => {
  pagination.value.page = 1
})

onMounted(() => {
  fetchData()
  autorStore.fetchAutores()
  categoryStore.fetchCategories()
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
    fetchData()
  })
}

// Lógica para formatar a data exibida no campo de filtro
const formattedDateRange = computed(() => {
  if (!filters.value.dateRange) return ''
  const from = typeof filters.value.dateRange === 'string' ? filters.value.dateRange : filters.value.dateRange.from
  const to = typeof filters.value.dateRange === 'string' ? filters.value.dateRange : filters.value.dateRange.to
  const formatDate = (dateString) => new Date(dateString.replace(/\//g, '-')).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  return from === to ? formatDate(from) : `${formatDate(from)} - ${formatDate(to)}`
})
</script>

<style lang="scss" scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
</style>