import type { GlobalThemeOverrides } from 'naive-ui'
import { computed, ref } from 'vue'

// 设计系统颜色定义
export const designTokens = {
  colors: {
    // 主色调 - 科技蓝
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryPressed: '#1D4ED8',
    primarySuppl: '#60A5FA',

    // 成功色 - 温和绿
    success: '#10B981',
    successHover: '#059669',
    successPressed: '#047857',
    successSuppl: '#34D399',

    // 警告色 - 温暖橙
    warning: '#F59E0B',
    warningHover: '#D97706',
    warningPressed: '#B45309',
    warningSuppl: '#FBBF24',

    // 危险色 - 柔和红
    error: '#EF4444',
    errorHover: '#DC2626',
    errorPressed: '#B91C1C',
    errorSuppl: '#F87171',

    // 信息色
    info: '#6B7280',
    infoHover: '#4B5563',
    infoPressed: '#374151',
    infoSuppl: '#9CA3AF'
  },

  // 中性色阶
  neutrals: {
    white: '#FFFFFF',
    gray50: '#F8FAFC',
    gray100: '#F1F5F9',
    gray200: '#E2E8F0',
    gray300: '#CBD5E1',
    gray400: '#94A3B8',
    gray500: '#64748B',
    gray600: '#475569',
    gray700: '#334155',
    gray800: '#1E293B',
    gray900: '#0F172A'
  },

  // 间距系统
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },

  // 圆角系统
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },

  // 阴影系统
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    lg: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    xl: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },

  // 字体系统
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  }
}

// Naive UI 主题覆盖配置
export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: designTokens.colors.primary,
    primaryColorHover: designTokens.colors.primaryHover,
    primaryColorPressed: designTokens.colors.primaryPressed,
    primaryColorSuppl: designTokens.colors.primarySuppl,

    successColor: designTokens.colors.success,
    successColorHover: designTokens.colors.successHover,
    successColorPressed: designTokens.colors.successPressed,
    successColorSuppl: designTokens.colors.successSuppl,

    warningColor: designTokens.colors.warning,
    warningColorHover: designTokens.colors.warningHover,
    warningColorPressed: designTokens.colors.warningPressed,
    warningColorSuppl: designTokens.colors.warningSuppl,

    errorColor: designTokens.colors.error,
    errorColorHover: designTokens.colors.errorHover,
    errorColorPressed: designTokens.colors.errorPressed,
    errorColorSuppl: designTokens.colors.errorSuppl,

    infoColor: designTokens.colors.info,
    infoColorHover: designTokens.colors.infoHover,
    infoColorPressed: designTokens.colors.infoPressed,
    infoColorSuppl: designTokens.colors.infoSuppl,

    // 字体
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.fontSize.sm,
    fontSizeMedium: designTokens.typography.fontSize.base,
    fontSizeLarge: designTokens.typography.fontSize.lg,
    fontSizeHuge: designTokens.typography.fontSize.xl,

    // 圆角
    borderRadius: designTokens.borderRadius.md,
    borderRadiusSmall: designTokens.borderRadius.sm,

    // 行高
    lineHeight: '1.6'
  }
}

// 暗色主题覆盖配置
export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: designTokens.colors.primary,
    primaryColorHover: designTokens.colors.primaryHover,
    primaryColorPressed: designTokens.colors.primaryPressed,
    primaryColorSuppl: designTokens.colors.primarySuppl,

    successColor: designTokens.colors.success,
    successColorHover: designTokens.colors.successHover,
    successColorPressed: designTokens.colors.successPressed,
    successColorSuppl: designTokens.colors.successSuppl,

    warningColor: designTokens.colors.warning,
    warningColorHover: designTokens.colors.warningHover,
    warningColorPressed: designTokens.colors.warningPressed,
    warningColorSuppl: designTokens.colors.warningSuppl,

    errorColor: designTokens.colors.error,
    errorColorHover: designTokens.colors.errorHover,
    errorColorPressed: designTokens.colors.errorPressed,
    errorColorSuppl: designTokens.colors.errorSuppl,

    infoColor: designTokens.colors.info,
    infoColorHover: designTokens.colors.infoHover,
    infoColorPressed: designTokens.colors.infoPressed,
    infoColorSuppl: designTokens.colors.infoSuppl,

    // 字体
    fontFamily: designTokens.typography.fontFamily,
    fontSize: designTokens.typography.fontSize.sm,
    fontSizeMedium: designTokens.typography.fontSize.base,
    fontSizeLarge: designTokens.typography.fontSize.lg,
    fontSizeHuge: designTokens.typography.fontSize.xl,

    // 圆角
    borderRadius: designTokens.borderRadius.md,
    borderRadiusSmall: designTokens.borderRadius.sm,

    // 行高
    lineHeight: '1.6'
  }
}

// 主题切换逻辑
export const useTheme = () => {
  const isDark = ref(false)

  const currentThemeOverrides = computed(() => {
    return isDark.value ? darkThemeOverrides : lightThemeOverrides
  })

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    currentThemeOverrides,
    toggleTheme
  }
}
