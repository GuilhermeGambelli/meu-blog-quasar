<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">{{ isEditMode ? 'Editar Categoria' : 'Nova Categoria' }}</h1>
    <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 600px">
      <q-input
        filled
        v-model="categoryData.nome"
        label="Nome da Categoria *"
        :rules="[val => !!val || 'O nome é obrigatório']"
      />
      <div class="q-mt-xl">
        <q-btn label="Salvar" type="submit" color="primary" :loading="loading" />
        <q-btn label="Cancelar" color="grey-8" flat class="q-ml-sm" @click="$router.back()" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { mapActions } from 'pinia'
import { useCategoryStore } from 'src/stores/categoria-store'

export default {
  name: 'FormCategoriaPage',
  data() {
    return {
      categoryData: { nome: '' },
      isEditMode: false,
      loading: false
    }
  },
  methods: {
    ...mapActions(useCategoryStore, ['createCategory', 'updateCategory']),
    async onSubmit() {
      this.loading = true
      try {
        if (this.isEditMode) {
          await this.updateCategory(this.categoryData)
          this.$q.notify({ type: 'positive', message: 'Categoria atualizada!' })
        } else {
          await this.createCategory(this.categoryData)
          this.$q.notify({ type: 'positive', message: 'Categoria criada!' })
        }
        this.$router.push('/categorias')
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Falha ao salvar.' })
      } finally {
        this.loading = false
      }
    }
  },
  created() {
    // Simples verificação de modo de edição (sem fetch, já que só temos um campo)
    if (this.$route.params.id) {
      this.isEditMode = true
      this.categoryData.id = this.$route.params.id
      // Em um caso real com mais campos, você faria um fetch aqui
    }
  }
}
</script>