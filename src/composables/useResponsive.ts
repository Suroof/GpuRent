import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * 响应式设计工具
 * 提供屏幕尺寸判断和响应式状态管理
 */
export function useResponsive() {
  const screenWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

  // 断点定义
  const breakpoints = {
    xs: 480,
    sm: 768,
    md: 1024,
    lg: 1200,
    xl: 1600
  }

  // 响应式状态
  const isMobile = computed(() => screenWidth.value < breakpoints.sm)
  const isTablet = computed(
    () => screenWidth.value >= breakpoints.sm && screenWidth.value < breakpoints.md
  )
  const isDesktop = computed(() => screenWidth.value >= breakpoints.md)
  const isLargeScreen = computed(() => screenWidth.value >= breakpoints.lg)
  const isExtraLarge = computed(() => screenWidth.value >= breakpoints.xl)

  // 具体尺寸判断
  const isXs = computed(() => screenWidth.value < breakpoints.xs)
  const isSm = computed(
    () => screenWidth.value >= breakpoints.xs && screenWidth.value < breakpoints.sm
  )
  const isMd = computed(
    () => screenWidth.value >= breakpoints.sm && screenWidth.value < breakpoints.md
  )
  const isLg = computed(
    () => screenWidth.value >= breakpoints.md && screenWidth.value < breakpoints.lg
  )
  const isXl = computed(
    () => screenWidth.value >= breakpoints.lg && screenWidth.value < breakpoints.xl
  )
  const is2xl = computed(() => screenWidth.value >= breakpoints.xl)

  // 屏幕类型
  const screenType = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  // 更新屏幕宽度
  const updateScreenWidth = () => {
    screenWidth.value = window.innerWidth
  }

  // 监听器管理
  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateScreenWidth)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateScreenWidth)
    }
  })

  // 获取响应式列数
  const getResponsiveCols = (cols: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }) => {
    if (isXs.value && cols.xs) return cols.xs
    if (isSm.value && cols.sm) return cols.sm
    if (isMd.value && cols.md) return cols.md
    if (isLg.value && cols.lg) return cols.lg
    if (is2xl.value && cols.xl) return cols.xl
    return cols.md || 1
  }

  // 获取响应式间距
  const getResponsiveGap = (gap: { xs?: number; sm?: number; md?: number; lg?: number }) => {
    if (isMobile.value) return gap.xs || gap.sm || 12
    if (isTablet.value) return gap.sm || gap.md || 16
    if (isDesktop.value) return gap.md || gap.lg || 24
    return gap.lg || 24
  }

  // 获取响应式padding
  const getResponsivePadding = (padding: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
  }) => {
    if (isMobile.value) return padding.xs || padding.sm || '12px'
    if (isTablet.value) return padding.sm || padding.md || '16px'
    if (isDesktop.value) return padding.md || padding.lg || '24px'
    return padding.lg || '24px'
  }

  return {
    // 基础状态
    screenWidth,
    screenType,

    // 断点判断
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isExtraLarge,

    // 具体尺寸
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,

    // 工具方法
    getResponsiveCols,
    getResponsiveGap,
    getResponsivePadding,

    // 断点常量
    breakpoints
  }
}

/**
 * 全局响应式状态单例
 * 在多个组件间共享响应式状态
 */
let globalResponsiveInstance: ReturnType<typeof useResponsive> | null = null

export function useGlobalResponsive() {
  if (!globalResponsiveInstance) {
    globalResponsiveInstance = useResponsive()
  }
  return globalResponsiveInstance
}
