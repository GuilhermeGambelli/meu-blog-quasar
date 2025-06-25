import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useAutorStore = defineStore('autor', {
  // STATE: Uma função que retorna o objeto de estado inicial.
  state: () => ({
    autores: [],
    currentAutor: null,
    loading: false,
    error: null
  }),

  // GETTERS: Funções que calculam um estado derivado.
  getters: {
    allAutores: (state) => state.autores,
    isLoading: (state) => state.loading
  },

  // ACTIONS: Métodos para executar lógica assíncrona e modificar o estado.
  actions: {
    // Para modificar o state, usamos `this`. Ex: `this.loading = true`
    async fetchAutores () {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/autores')
        this.autores = response.data
      } catch (e) {
        this.error = 'Falha ao carregar autores.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async fetchAutorById (id) {
      this.loading = true
      this.currentAutor = null
      this.error = null
      try {
        const response = await api.get(`/autores/${id}`)
        this.currentAutor = response.data
      } catch (e) {
        this.error = 'Falha ao carregar o autor.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async createAutor (autorData) {
      this.loading = true
      try {
        const response = await api.post('/autores', autorData)
        this.autores.push(response.data)
        return response.data
      } catch (e) {
        this.error = 'Falha ao criar autor.'
        console.error(e)
        throw e 
      } finally {
        this.loading = false
      }
    },

    async updateAutor (autorData) {
      this.loading = true
      try {
        const response = await api.put(`/autores/${autorData.id}`, autorData)
        const index = this.autores.findIndex(a => a.id === autorData.id)
        if (index !== -1) {
          this.autores.splice(index, 1, response.data)
        }
        return response.data
      } catch (e) {
        this.error = 'Falha ao atualizar autor.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteAutor (id) {
      this.loading = true
      try {
        await api.delete(`/autores/${id}`)
        this.autores = this.autores.filter(a => a.id !== id)
      } catch (e) {
        this.error = 'Falha ao deletar autor.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})