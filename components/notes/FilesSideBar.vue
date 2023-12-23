<script setup lang="ts">
import { dateToString } from '~/composables/useDate'

defineProps<{
  notesInfo: NoteInfo[]
}>()

const emits = defineEmits<
{(e: 'select', id: number): void
}>()
</script>

<template>
  <div class="gap-2 bordered-right overflow-y-auto">
    <div v-for="i in notesInfo" :key="i.id" @dblclick="emits('select', i.id)">
      <div class="title">
        {{ i.title }}
      </div>
      <div class="time">
        {{ dateToString(i.modifiedAt) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-weight: bold;
  font-size: 1.25rem;
  padding: 0.5rem 0.5rem 0 0.5rem;
  user-select: none;
}

.time {
  font-size: 0.875rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
  user-select: none;
}

.bordered-right {
  box-shadow: 1px 0 0 0 #77777720;
}
</style>
