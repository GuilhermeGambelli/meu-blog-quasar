import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [],
    currentPost: null,
    totalPosts: 0,
    loading: false,
    error: null
  }),

  getters: {
    allPosts: (state) => state.posts,
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    async fetchPosts (filterParams = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/posts', { params: filterParams })
        this.posts = response.data
        this.totalPosts = parseInt(response.headers['x-total-count'] || 0, 10)
      } catch (e) {
        this.error = 'Falha ao carregar posts.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async fetchPostById (id) {
      this.loading = true
      this.currentPost = null
      this.error = null
      try {
        const response = await api.get(`/posts/${id}`)
        this.currentPost = response.data
      } catch (e) {
        this.error = 'Falha ao carregar o post.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async createPost (postData) {
      this.loading = true
      try {
        const response = await api.post('/posts', postData)
        return response.data
      } catch (e) {
        this.error = 'Falha ao criar post.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updatePost (postData) {
      this.loading = true
      try {
        const response = await api.put(`/posts/${postData.id}`, postData)
        return response.data
      } catch (e) {
        this.error = 'Falha ao atualizar post.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async deletePost (id) {
      this.loading = true
      try {
        await api.delete(`/posts/${id}`)
      } catch (e) {
        this.error = 'Falha ao deletar post.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})