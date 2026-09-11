<template>
  <div class="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
    <div
      class="bg-component-background border border-secondary-button-background p-4 sm:p-8 lg:col-span-2"
    >
      <label for="session-summary" class="font-mono text-xs uppercase text-text-alert pb-3"
        >Résumé de la séance</label
      >
      <textarea
        id="session-summary"
        :value="session.resume"
        class="w-full resize-none overflow-hidden appearance-none text-base text-text-primary carret-primary-button-background"
        @input="updateResume"
      />
    </div>
    <div class="bg-component-background border border-secondary-button-background p-4 sm:p-8">
      <h1 class="font-mono text-xs uppercase text-text-alert">Points clés</h1>
      <ul class="border-b border-secondary-button-background py-3 flex flex-col gap-3">
        <li v-for="keypoint in session.keypoint" :key="keypoint.id" class="flex">
          <label
            :for="keypoint.id"
            class="flex cursor-pointer items-center gap-2 font-body text-sm text-text-primary"
          >
            <input
              type="checkbox"
              :id="keypoint.id"
              :name="keypoint.label"
              v-model="keypoint.state"
              @change="updateState"
              class="keypoint-checkbox"
            />
            <span class="keypoint-checkbox-mark" aria-hidden="true"></span>
            <span class="keypoint-label">{{ keypoint.label }}</span>
          </label>
        </li>
      </ul>
      <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3">
        <input
          type="text"
          id=""
          v-model="newKeypoint.label"
          placeholder="Ajouter un point clé..."
          class="border border-secondary-button-background font-body text-text-primary bg-background text-sm p-3 col-span-4"
        />
        <button
          class="border border-text-detail bg-secondary-button-background p-2 text-text-alert hover:border-text-alert"
          @click="addKeypoint()"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/sessions'
import { useRoute } from 'vue-router'

const route = useRoute()

const sessionStore = useSessionStore()
const newKeypoint = ref({ id: Math.random().toString(36).slice(2, 10), label: '', state: false })

const resizeTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement

  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

const updateResume = (event: Event) => {
  resizeTextarea(event)
  sessionStore.sessionUpdate(String(route.params.id), {
    resume: (event.target as HTMLTextAreaElement).value,
  })
}

const updateState = () => {
  sessionStore.sessionUpdate(String(route.params.id), {
    keypoint: props.session.keypoint,
  })
}

onMounted(() => {
  const textarea = document.getElementById('goal-npc') as HTMLTextAreaElement | null

  if (textarea) {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }
})

function addKeypoint() {
  const session = props.session

  session.keypoint.push(newKeypoint.value)
  sessionStore.sessionUpdate(String(route.params.id), { keypoint: session.keypoint })
  newKeypoint.value = { id: Math.random().toString(36).slice(2, 10), label: '', state: false }
}

const props = defineProps<{
  session: {
    id: string
    name: string
    description: string
    resume: string
    keypoint: { id: string; label: string; state: boolean }[]
    music: { id: string; label: string; categorie: string; link: string }[]
    pnj: { pnjId: string; but: string }[]
    updatedAt: string
  }
}>()
</script>

<style scoped>
.keypoint-checkbox {
  appearance: none;
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.keypoint-checkbox-mark {
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  border: 1px solid var(--color-text-primary, #e9e2d3);
  background-color: var(--color-component-background, #201f1a);
}

.keypoint-checkbox:checked + .keypoint-checkbox-mark {
  border-color: var(--color-primary-button-background, #c29a4b);
  background-color: var(--color-primary-button-background, #c29a4b);
}

.keypoint-checkbox:checked + .keypoint-checkbox-mark::after {
  position: absolute;
  top: 50%;
  left: 50%;
  color: var(--color-component-background, #201f1a);
  content: '✓';
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1;
  transform: translate(-50%, -50%);
}

.keypoint-checkbox:checked + .keypoint-checkbox-mark + .keypoint-label {
  color: #6f6857;
  text-decoration: line-through;
}
</style>
