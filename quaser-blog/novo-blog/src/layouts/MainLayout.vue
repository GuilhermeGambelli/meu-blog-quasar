<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseleave="miniState = true"
      mini-to-overlay
      :width="250"
      :breakpoint="500"
      class="bg-grey-10 text-white"
    >
      <div class="drawer-logo-container">
        <q-img
          v-if="!miniState"
          src="/logos/logo-completo.png"
          fit="contain"
          height="40px"
          class="q-ma-md"
        />
        <q-img
          v-else
          src="/logos/logo-mini.png"
          fit="contain"
          height="30px"
        />
      </div>

      <q-separator dark />

      <q-list padding>
        <template v-for="link in menuLinks" :key="link.title">
          <q-expansion-item
            v-if="link.children"
            :icon="link.icon"
            :label="link.title"
            group="main-menu"
            header-class="text-white"
            expand-icon-class="text-white"
          >
            <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 10]">
              {{ link.title }}
            </q-tooltip>
            <q-list class="q-pl-lg">
              <q-item
                v-for="child in link.children"
                :key="child.title"
                clickable
                v-ripple
                :to="child.to"
                exact
                class="menu-link"
              >
                <q-item-section avatar>
                  <q-icon :name="child.icon" color="white"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ child.title }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const miniState = ref(true)

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

<style lang="scss" scoped>
.menu-link.q-item--active {
  color: white !important;
  background-color: rgba(25, 118, 210, 0.3);
  border-left: 4px solid $primary;
}

.drawer-logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>