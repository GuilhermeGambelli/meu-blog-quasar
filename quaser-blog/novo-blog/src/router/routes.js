const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }, // Página inicial

      // Rotas para Posts
      { path: 'posts', component: () => import('pages/posts/ListPostsPage.vue') },
      { path: 'posts/novo', component: () => import('pages/posts/FormPostPage.vue'), meta: { mode: 'create' } },
      { path: 'posts/:id/editar', component: () => import('pages/posts/FormPostPage.vue'), meta: { mode: 'edit' }, props: true },
      { path: 'posts/:id', component: () => import('pages/posts/ViewPostPage.vue'), props: true },

      // Rotas para Autores
      { path: 'autores', component: () => import('pages/autores/ListAutoresPage.vue') },
      { path: 'autores/novo', component: () => import('pages/autores/FormAutorPage.vue'), meta: { mode: 'create' } },
      { path: 'autores/:id/editar', component: () => import('pages/autores/FormAutorPage.vue'), meta: { mode: 'edit' }, props: true }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes