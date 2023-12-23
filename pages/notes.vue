<script setup lang="ts">
import md5 from 'md5'
import { useDebounceFn } from '@vueuse/core'
import CodeMirror from '~/components/notes/CodeMirror.vue'
import FilesSideBar from '~/components/notes/FilesSideBar.vue'
import EditorStatus from '~/components/notes/EditorStatus.vue'
import type { Database } from '~~/types/database.types'
import { defaultNote } from '~/composables/constants'

const user = useSupabaseUser()

const client = useSupabaseClient<Database>()
const { data: notesInfo } = await useAsyncData('notes-info', async () => {
  const { data } = await client
    .from('notes')
    .select('id, title, modified_at')
    .order('modified_at', { ascending: false })
  return data.map(i => ({ id: i.id, title: i.title, modifiedAt: new Date(i.modified_at) }))
})

const current = ref(-1)
const loading = ref(false)
const editAt = ref(0)
const saveAt = ref(0)

const note = ref<Notes>(defaultNote)
const notesStore = useState<Map<number, Notes>>('notes-store', () => new Map<number, Notes>())

const saveFn = useDebounceFn(() => {
  uploadNote()
  saveAt.value = Date.now()
}, 60000)

function onEditHandler (t: number) {
  editAt.value = t
  saveFn()
}

function fetchNoteFromStore () {
  const n = notesStore.value.get(current.value)
  if (typeof n === 'undefined' || !n) { return false }
  note.value = n
  return true
}

async function fetchNoteFromRemote () {
  const { data } = await client.from('notes').select('*').match({ id: current.value }).single()
  if (!data) { return }
  data.created_at = new Date(data.created_at)
  data.modified_at = new Date(data.modified_at)
  note.value = data
  if (data.hash !== notesStore.value.get(current.value)?.hash) {
    notesStore.value.set(current.value, data)
  }
}

async function getCurrentNote (id: number) {
  if (loading.value) { return }
  current.value = id
  loading.value = true
  try {
  // get from state
    if (fetchNoteFromStore()) { return }
    // get from remote
    await fetchNoteFromRemote()
    editAt.value = new Date(note.value.modified_at).getTime()
  } finally {
    loading.value = false
  }
}

const uploading = ref(false)
async function uploadNote () {
  uploading.value = true
  const time = new Date()
  try {
    await client
      .from('notes')
      .update({
        title: note.value.title,
        content: note.value.content,
        modified_at: time,
        hash: md5(note.value.content)
      })
      .match({ id: note.value.id })
    // TODO: update local
    notesStore.value.set(note.value.id, {
      ...notesStore.value.get(note.value.id),
      title: note.value.title,
      content: note.value.content,
      modified_at: time,
      hash: md5(note.value.content)
    })
  } finally {
    uploading.value = false
  }
}

const newing = ref(false)
async function newNote () {
  newing.value = true
  try {
    const { data } = await client
      .from('notes')
      .upsert({
        title: 'Untitled',
        user_id: user.value.id,
        content: '',
        directory: ''
      })
      .select('id, title, modified_at')
      .single()
    if (!data) { return }
    const newNote: NoteInfo = { id: data.id, title: data.title, modifiedAt: new Date(data.modified_at) }
    notesInfo.value.unshift(newNote)
  } finally {
    newing.value = false
  }
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 flex">
      <FilesSideBar
        :notes-info="notesInfo"
        @select="getCurrentNote"
      />
      <CodeMirror
        v-model:doc="note.content"
        v-model:title="note.title"
        :modified-at="note.modified_at"
        class="flex-1"
        @edit="onEditHandler"
      />
    </div>
    <EditorStatus
      :current="current"
      :edit-at="editAt"
      :uploading="uploading"
      :newing="newing"
      :saved-at="saveAt"
      @upload="uploadNote"
      @new="newNote"
    />
  </div>
</template>
