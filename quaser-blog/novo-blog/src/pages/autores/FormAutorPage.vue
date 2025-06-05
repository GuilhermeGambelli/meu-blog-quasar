<template>
  <q-page padding>
    <h1 class="text-h4 q-mb-md">{{ isEditMode ? 'Editar Autor' : 'Criar Novo Autor' }}</h1>

    <q-form @submit="onSubmit" class="q-gutter-md" style="max-width: 600px">
      <q-input
        filled
        v-model="autorData.nome"
        label="Nome Completo *"
        :rules="[val => !!val || 'O nome é obrigatório']"
      />

      <q-input
        filled
        v-model="autorData.email"
        label="E-mail *"
        type="email"
        :rules="[ val => !!val || 'O e-mail é obrigatório' ]"
      />

      <div class="q-mt-xl row items-center justify-between">
        <div>
          <q-btn label="Salvar Autor" type="submit" color="primary" :loading="loading" />
          <q-btn label="Cancelar" color="grey-8" flat class="q-ml-sm" @click="$router.back()" />
        </div>
        <q-btn
          v-if="isEditMode"
          label="Deletar Autor"
          icon="delete"
          color="negative"
          flat
          @click="handleDelete"
          :loading="loading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAutorStore } from 'src/stores/autor-store'

export default {
  name: 'FormAutorPage',
  data() {
    return {
      autorData: {
        nome: '',
        email: ''
      }
    }
  },
  computed: {
    ...mapState(useAutorStore, ['currentAutor', 'loading']),
    isEditMode() {
      return !!this.$route.params.id
    }
  },
  methods: {
    ...mapActions(useAutorStore, ['createAutor', /*...*/]),
    async onSubmit() {
      try {
        if (this.isEditMode) {
          await this.updateAutor(this.autorData)
          this.$q.notify({ type: 'positive', message: 'Autor atualizado!' }) // Note o `this.$q`
        } else {
          await this.createAutor(this.autorData)
          this.$q.notify({ type: 'positive', message: 'Autor criado!' }) // Note o `this.$q`
        }
        this.$router.push('/autores')
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Falha ao salvar o autor.' }) // Note o `this.$q`
      }
    },
    async handleDelete() {
      this.$q.dialog({
        title: 'Confirmar Exclusão',
        message: 'Tem certeza?',
        cancel: true
      }).onOk(async () => {
        await this.deleteAutor(this.autorData.id)
        this.$q.notify({ type: 'positive', message: 'Autor deletado!' })
        this.$router.push('/autores')
      })
    }
  },
  watch: {
    currentAutor(newAutor) {
      if (newAutor && this.isEditMode) {
        this.autorData = { ...newAutor }
      }
    }
  },
  created() {
    if (this.isEditMode) {
      this.fetchAutorById(this.$route.params.id)
    }
  }
}
</script>