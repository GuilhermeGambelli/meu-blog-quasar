<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Nave Quasar Blog
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Menu Principal
        </q-item-label>

        <template v-for="link in menuLinks" :key="link.title">
          <q-expansion-item
            v-if="link.children"
            :icon="link.icon"
            :label="link.title"
            group="main-menu"
          >
            <q-list class="q-pl-lg">
              <q-item
                v-for="child in link.children"
                :key="child.title"
                clickable
                v-ripple
                :to="child.to"
                exact
              >
                <q-item-section avatar>
                  <q-icon :name="child.icon" />
                </q-item-section>
                <q-item-section>
                  {{ child.title }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <q-item
            v-else
            clickable
            v-ripple
            :to="link.to"
            exact
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              {{ link.title }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Nova estrutura de dados para o menu com itens e sub-itens (children)
const menuLinks = ref([
  {
    title: 'Posts',
    icon: 'article',
    children: [
      { title: 'Ver todos os posts', icon: 'view_list', to: '/posts' },
      { title: 'Criar novo post', icon: 'add_circle_outline', to: '/posts/novo' }
    ]
  },
  {
    title: 'Autores',
    icon: 'people',
    children: [
      { title: 'Gerenciar autores', icon: 'manage_accounts', to: '/autores' },
      { title: 'Adicionar novo autor', icon: 'person_add', to: '/autores/novo' }
    ]
  },
  {
    title: 'Categorias',
    icon: 'category',
    children: [
      { title: 'Gerenciar categorias', icon: 'view_list', to: '/categorias' },
      { title: 'Nova categoria', icon: 'add_circle_outline', to: '/categorias/nova' }
    ]
  }
])
</script>