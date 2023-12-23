<script setup lang="ts">
const client = useSupabaseClient()
const user = useSupabaseUser()
const colorMode = useColorMode()

const toggleDark = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const colorModeIcon = computed(() => colorMode.preference === 'dark' ? 'i-heroicons-outline-moon' : 'i-heroicons-outline-sun')

const logout = async () => {
  await client.auth.signOut()
  navigateTo('/')
}
</script>

<template>
  <div>
    <Title>Nuxt 3 x Supabase</Title>
    <div class="flex items-center md:justify-between justify-center top-bar">
      <div class="hidden md:block">
        <UButton
          label="Source"
          color="white"
          variant="ghost"
          target="_blank"
          to="https://github.com/widcardw/supa-note"
          icon="i-heroicons-outline-external-link"
        />
        <UButton
          label="Hosted on Netlify"
          color="white"
          variant="ghost"
          target="_blank"
          to="https://netlify.com"
          icon="i-heroicons-outline-external-link"
        />
      </div>
      <div class="flex items-center">
        <a target="_blank" :href="'https://github.com/' + user?.user_metadata?.user_name || ''">
          <UButton variant="ghost">
            <UAvatar size="xs" :src="user?.user_metadata?.avatar_url || ''" alt="User" />
          </UButton>
        </a>
        <UButton
          color="white"
          variant="ghost"
          :icon="colorModeIcon"
          @click="toggleDark"
        />
        <UButton
          v-if="user"
          color="white"
          variant="ghost"
          @click="logout"
        >
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  box-shadow: 0 1px 0 0 #77777720;
}
</style>
