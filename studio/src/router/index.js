import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import SeriesDetailView from '../views/SeriesDetailView.vue'
import ScriptEditorView from '../views/ScriptEditorView.vue'
import PromptMatrixView from '../views/PromptMatrixView.vue'
import VoiceoverStudioView from '../views/VoiceoverStudioView.vue'
import EngineCodexView from '../views/EngineCodexView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/franchises/:id',
    name: 'series-detail',
    component: SeriesDetailView
  },
  {
    path: '/editor/:franchiseId/:episodeId',
    name: 'script-editor',
    component: ScriptEditorView
  },
  {
    path: '/prompts/:franchiseId/:episodeId',
    name: 'prompt-matrix',
    component: PromptMatrixView
  },
  {
    path: '/tts/:franchiseId/:episodeId',
    name: 'voiceover-studio',
    component: VoiceoverStudioView
  },
  {
    path: '/engine',
    name: 'engine-codex',
    component: EngineCodexView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
