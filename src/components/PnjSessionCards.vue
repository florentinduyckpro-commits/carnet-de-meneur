<template>
  <div
    class="grid min-w-0 grid-cols-1 gap-4 bg-component-background p-4 border border-secondary-button-background lg:grid-cols-6"
  >
    <img
      class="w-[104px] h-[128px] border border-secondary-button-background bg-secondary-button-background"
      :src="pnj.image"
      alt="Portrait"
    />
    <div class="flex min-w-0 flex-col gap-2 lg:col-span-3">
      <div class="flex min-w-0 flex-wrap items-start gap-2">
        <h1 class="text-text-primary font-title font-bold text-lg">
          {{ pnj.nom }}
        </h1>
        <p
          class="text-text-secondary font-mono text-xs border border-secondary-button-background p-2 lg:mr-auto"
        >
          {{ sessionCount }} sessions
        </p>
      </div>
      <p class="uppercase font-mono text-text-detail text-xs">personnalité</p>
      <p class="text-text-primary text-sm pb-2">
        {{ pnj.personnalite }}
      </p>
      <div class="flex flex-col border-l-2 border-primary-button-background px-2">
        <label
          :for="`goal-npc-${pnj.id}`"
          class="font-mono text-xs uppercase text-primary-button-background"
        >
          But dans cette séance
        </label>
        <textarea
          :id="`goal-npc-${pnj.id}`"
          ref="goalTextarea"
          :value="pnj.but"
          rows="1"
          class="w-full resize-none overflow-hidden appearance-none text-base text-text-primary carret-primary-button-background"
          @input="updateBut"
        />
      </div>
    </div>

    <div class="flex min-w-0 flex-col gap-2 lg:col-span-2">
      <div class="flex">
        <p class="font-mono text-xs uppercase text-primary-button-border">statistiques</p>
        <hr class="border-secondary-button-background border" />
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2">
        <div
          class="border border-secondary-button-background p-2"
          v-for="(stat, index) in pnj.stats"
          :key="index"
        >
          <h1 class="text-text-secondary text-xs font-body uppercase">{{ stat.label }}</h1>
          <p class="text-text-primary text-base font-mono">{{ stat.value }}</p>
        </div>
      </div>
      <button
        class="font-body text-xs text-text-delete hover:text-text-delete ml-2"
        type="button"
        @click="$emit('unlink', pnj.id)"
      >
        Délier
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/sessions'

const emit = defineEmits<{
  unlink: [pnjId: string]
  but: [pnjId: string, but: string]
}>()

const goalTextarea = ref<HTMLTextAreaElement | null>(null)
const sessionStore = useSessionStore()

const resizeTextarea = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement

  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

onMounted(() => {
  if (goalTextarea.value) {
    goalTextarea.value.style.height = 'auto'
    goalTextarea.value.style.height = `${goalTextarea.value.scrollHeight}px`
  }
})

const { pnj } = defineProps<{
  pnj: {
    id: string
    nom: string
    image: string
    personnalite: string
    but: string
    stats: { id: string; label: string; value: string }[]
  }
}>()

const sessionCount = computed(
  () =>
    sessionStore.Sessions.filter((session) => session.pnj.some(({ pnjId }) => pnjId === pnj.id))
      .length,
)

const updateBut = (event: Event) => {
  emit('but', pnj.id, (event.target as HTMLTextAreaElement).value)
  resizeTextarea(event)
}
</script>
