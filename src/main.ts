import './styles/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Naive UI
import naive from 'naive-ui'

import App from './App.vue'
import router from './router'
import { setupErrorHandler } from '@/utils/errorHandler'
import { useGlobalStore } from '@/stores/global'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(naive)

// 设置全局错误处理
setupErrorHandler(app)

// 初始化全局状态
const globalStore = useGlobalStore()
globalStore.initializeStore()

// 确保加载状态初始化为 false
globalStore.setLoading(false)

app.mount('#app')
