<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4">Categorias</h1>
      <q-btn
        label="Nova Categoria"
        color="primary"
        icon="add"
        @click="$router.push('/categorias/nova')"
      />
    </div>

    <q-table
      :rows="categories"
      :columns="columns"
      row-key="id"
      :loading="loading"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense round flat icon="edit" @click="editCategory(props.row.id)" color="blue-8" />
          <q-btn dense round flat icon="delete" @click="handleDeleteCategory(props.row.id)" color="red-8" />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useCategoryStore } from 'src/stores/categoria-store'

export default {
  name: 'ListCategoriasPage',
  computed: {
    ...mapState(useCategoryStore, ['categories', 'loading'])
  },
  data() {
    return {
      columns: [
        { name: 'nome', label: 'Nome da Categoria', align: 'left', field: 'nome', sortable: true },
        { name: 'actions', label: 'Ações', align: 'right' }
      ]
    }
  },
  methods: {
    ...mapActions(useCategoryStore, ['fetchCategories', 'deleteCategory']),
    editCategory(id) {
      this.$router.push(`/categorias/${id}/editar`)
    },
    handleDeleteCategory(id) {
      this.$q.dialog({
        title: 'Confirmar Exclusão',
        message: 'Tem certeza que deseja deletar esta categoria?',
        cancel: { label: 'Cancelar', flat: true },
        ok: { label: 'Deletar', color: 'negative' }
      }).onOk(async () => {
        await this.deleteCategory(id)
        this.$q.notify({ type: 'positive', message: 'Categoria deletada com sucesso!' })
        this.fetchCategories()
      })
    }
  },
  created() {
    this.fetchCategories()
  }
}
</script>