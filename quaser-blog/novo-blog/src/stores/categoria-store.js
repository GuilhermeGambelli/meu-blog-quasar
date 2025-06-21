import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),

  getters: {
    allCategories: (state) => state.categories
  },

  actions: {
    async fetchCategories () {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/categorias')
        this.categories = response.data
      } catch (e) {
        this.error = 'Falha ao carregar categorias.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async createCategory (categoryData) {
      try {
        const response = await api.post('/categorias', categoryData)
        this.categories.push(response.data)
        return response.data
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async updateCategory (categoryData) {
      try {
        const response = await api.put(`/categorias/${categoryData.id}`, categoryData)
        const index = this.categories.findIndex(c => c.id === categoryData.id)
        if (index !== -1) {
          this.categories.splice(index, 1, response.data)
        }
        return response.data
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async deleteCategory (id) {
      try {
        await api.delete(`/categorias/${id}`)
        this.categories = this.categories.filter(c => c.id !== id)
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  }
})