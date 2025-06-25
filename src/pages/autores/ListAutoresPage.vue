<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <h1 class="text-h4">Autores</h1>
      <q-btn
        label="Novo Autor"
        color="primary"
        icon="add"
        @click="$router.push('/autores/novo')"
      />
    </div>

    <q-table
      :rows="autores"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :grid="$q.screen.lt.md"
      :hide-header="$q.screen.lt.md"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense round flat icon="edit" @click="editAutor(props.row.id)" color="blue-8" />
          <q-btn dense round flat icon="delete" @click="handleDeleteAutor(props.row.id)" color="red-8" />
        </q-td>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6">
          <q-card bordered flat>
            <q-card-section>
              <div class="text-h6">{{ props.row.nome }}</div>
              <div class="text-grey-8">{{ props.row.email }}</div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat label="Editar" @click="editAutor(props.row.id)" />
              <q-btn flat color="negative" label="Deletar" @click="handleDeleteAutor(props.row.id)" />
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAutorStore } from 'src/stores/autor-store'

export default {
  name: 'ListAutoresPage',
  computed: {
    ...mapState(useAutorStore, ['autores', 'loading', 'error'])
  },
  data() {
    return {
      columns: [
        { name: 'nome', label: 'Nome', align: 'left', field: 'nome', sortable: true },
        { name: 'email', label: 'E-mail', align: 'left', field: 'email', sortable: true },
        { name: 'actions', label: 'Ações', align: 'right' }
      ]
    }
  },
  methods: {
    ...mapActions(useAutorStore, ['fetchAutores', 'deleteAutor']),
    editAutor(id) {
      this.$router.push(`/autores/${id}/editar`)
    },
    async handleDeleteAutor(id) {
      this.$q.dialog({
        title: 'Confirmar Exclusão',
        message: 'Tem certeza que deseja deletar este autor?',
        cancel: { label: 'Cancelar', flat: true },
        ok: { label: 'Deletar', color: 'negative' }
      }).onOk(async () => {
        await this.deleteAutor(id)
        this.$q.notify({ type: 'positive', message: 'Autor deletado com sucesso!' })
      })
    }
  },
  created() {
    this.fetchAutores()
  }
}
</script>