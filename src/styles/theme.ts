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

// 暗色主题颜色定义
export const darkDesignTokens = {
  colors: {
    // 主色调 - 科技蓝（暗色模式下更亮）
    primary: '#60A5FA',
    primaryHover: '#3B82F6',
    primaryPressed: '#2563EB',
    primarySuppl: '#93C5FD',

    // 成功色
    success: '#34D399',
    successHover: '#10B981',
    successPressed: '#059669',
    successSuppl: '#6EE7B7',

    // 警告色
    warning: '#FBBF24',
    warningHover: '#F59E0B',
    warningPressed: '#D97706',
    warningSuppl: '#FCD34D',

    // 危险色
    error: '#F87171',
    errorHover: '#EF4444',
    errorPressed: '#DC2626',
    errorSuppl: '#FCA5A5',

    // 信息色
    info: '#9CA3AF',
    infoHover: '#6B7280',
    infoPressed: '#4B5563',
    infoSuppl: '#D1D5DB'
  },
  neutrals: {
    white: '#0F172A',
    gray50: '#1E293B',
    gray100: '#334155',
    gray200: '#475569',
    gray300: '#64748B',
    gray400: '#94A3B8',
    gray500: '#CBD5E1',
    gray600: '#E2E8F0',
    gray700: '#F1F5F9',
    gray800: '#F8FAFC',
    gray900: '#FFFFFF'
  }
}
// 暗色主题覆盖配置
export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: darkDesignTokens.colors.primary,
    primaryColorHover: darkDesignTokens.colors.primaryHover,
    primaryColorPressed: darkDesignTokens.colors.primaryPressed,
    primaryColorSuppl: darkDesignTokens.colors.primarySuppl,

    successColor: darkDesignTokens.colors.success,
    successColorHover: darkDesignTokens.colors.successHover,
    successColorPressed: darkDesignTokens.colors.successPressed,
    successColorSuppl: darkDesignTokens.colors.successSuppl,

    warningColor: darkDesignTokens.colors.warning,
    warningColorHover: darkDesignTokens.colors.warningHover,
    warningColorPressed: darkDesignTokens.colors.warningPressed,
    warningColorSuppl: darkDesignTokens.colors.warningSuppl,

    errorColor: darkDesignTokens.colors.error,
    errorColorHover: darkDesignTokens.colors.errorHover,
    errorColorPressed: darkDesignTokens.colors.errorPressed,
    errorColorSuppl: darkDesignTokens.colors.errorSuppl,

    infoColor: darkDesignTokens.colors.info,
    infoColorHover: darkDesignTokens.colors.infoHover,
    infoColorPressed: darkDesignTokens.colors.infoPressed,
    infoColorSuppl: darkDesignTokens.colors.infoSuppl,

    // 背景色
    bodyColor: darkDesignTokens.neutrals.white,
    popoverColor: darkDesignTokens.neutrals.gray50,
    cardColor: darkDesignTokens.neutrals.gray50,
    modalColor: darkDesignTokens.neutrals.gray50,

    // 边框色
    borderColor: darkDesignTokens.neutrals.gray200,
    dividerColor: darkDesignTokens.neutrals.gray200,

    // 文本色
    textColorBase: darkDesignTokens.neutrals.gray900,
    textColor1: darkDesignTokens.neutrals.gray900,
    textColor2: darkDesignTokens.neutrals.gray700,
    textColor3: darkDesignTokens.neutrals.gray600,
    textColorDisabled: darkDesignTokens.neutrals.gray400,

    // 输入框背景
    inputColor: darkDesignTokens.neutrals.gray100,
    inputColorDisabled: darkDesignTokens.neutrals.gray50,

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
