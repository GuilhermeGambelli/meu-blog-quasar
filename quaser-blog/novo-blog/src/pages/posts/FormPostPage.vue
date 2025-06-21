<template>
  <q-page padding>
    <h1 :class="$q.screen.lt.sm ? 'text-h5' : 'text-h4'" class="q-mb-md">
      {{ isEditMode ? 'Editar Post' : 'Criar Novo Post' }}
    </h1>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-input
            filled
            v-model="postData.titulo"
            label="Título do Post *"
            lazy-rules
            :rules="[val => !!val || 'O título é obrigatório']"
          />

          <q-input
            filled
            v-model="postData.pequenaDescricao"
            label="Pequena Descrição *"
            type="textarea"
            class="q-mt-md"
            lazy-rules
            :rules="[val => !!val || 'A descrição é obrigatória']"
          />

          <q-editor
            v-model="postData.conteudo"
            min-height="15rem"
            class="q-mt-md"
            placeholder="Conteúdo completo do post..."
          />
        </div>

        <div class="col-12 col-md-4">
          <q-select
            filled
            v-model="postData.autorId"
            :options="autorOptions"
            label="Autor *"
            emit-value
            map-options
            lazy-rules
            :rules="[val => !!val || 'Selecione um autor']"
          />

          <q-select
            filled
            v-model="postData.categoria"
            :options="categoryOptions"
            label="Categoria *"
            class="q-mt-md"
            lazy-rules
            :rules="[val => !!val || 'Selecione uma categoria']"
          />

          <q-input
            filled
            v-model="postData.imagem"
            label="URL da Imagem *"
            class="q-mt-md"
            lazy-rules
            :rules="[val => !!val || 'A URL da imagem é obrigatória']"
          />
        </div>
      </div>

      <div class="q-mt-xl row items-center justify-between">
        <div>
          <q-btn label="Salvar Post" type="submit" color="primary" :loading="postStore.loading" />
          <q-btn label="Cancelar" color="grey-8" flat class="q-ml-sm" @click="router.back()" />
        </div>
        <q-btn
          v-if="isEditMode"
          label="Deletar Post"
          icon="delete"
          color="negative"
          flat
          @click="handleDelete"
          :loading="postStore.loading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostStore } from 'src/stores/post-store'
import { useAutorStore } from 'src/stores/autor-store'
import { useCategoryStore } from 'src/stores/categoria-store' // 1. IMPORTA A NOVA STORE
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

// Instanciando todas as stores necessárias
const postStore = usePostStore()
const autorStore = useAutorStore()
const categoryStore = useCategoryStore() // 2. INSTANCIA A NOVA STORE

// Tornando o state reativo
const { currentPost } = storeToRefs(postStore)
const { allAutores: autores } = storeToRefs(autorStore)
const { allCategories: categories } = storeToRefs(categoryStore) // 3. OBTÉM AS CATEGORIAS

const postId = computed(() => route.params.id)
const isEditMode = computed(() => !!postId.value)

// Opções de Autor (como antes)
const autorOptions = computed(() => autores.value.map(autor => ({
  label: autor.nome,
  value: autor.id
})))

// 4. OPÇÕES DE CATEGORIA AGORA SÃO DINÂMICAS
const categoryOptions = computed(() => categories.value.map(cat => cat.nome))

const postData = ref({
  titulo: '',
  pequenaDescricao: '',
  conteudo: '',
  categoria: null,
  autorId: null,
  imagem: ''
})

onMounted(() => {
  // 5. BUSCA OS DADOS NECESSÁRIOS AO MONTAR O COMPONENTE
  autorStore.fetchAutores()
  categoryStore.fetchCategories()
  if (isEditMode.value) {
    postStore.fetchPostById(postId.value)
  }
})

watch(currentPost, (newPost) => {
  if (newPost && isEditMode.value) {
    postData.value = { ...newPost }
  }
})

async function onSubmit () {
  try {
    if (isEditMode.value) {
      await postStore.updatePost({ ...postData.value, dataUltimaAlteracao: new Date().toISOString() })
      $q.notify({ type: 'positive', message: 'Post atualizado com sucesso!' })
    } else {
      await postStore.createPost({ ...postData.value, dataPublicacao: new Date().toISOString(), dataUltimaAlteracao: new Date().toISOString() })
      $q.notify({ type: 'positive', message: 'Post criado com sucesso!' })
    }
    router.push('/posts')
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Falha ao salvar o post.' })
  }
}

async function handleDelete () {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: 'Tem certeza que deseja deletar este post?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Deletar', color: 'negative' }
  }).onOk(async () => {
    await postStore.deletePost(postId.value)
    $q.notify({ type: 'positive', message: 'Post deletado com sucesso!' })
    router.push('/posts')
  })
}
</script>