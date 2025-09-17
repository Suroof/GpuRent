# GPU租借平台后台管理系统 - 完整项目文档

### 目录结构设计

```
src/
├── api/                 # API接口层
│   ├── types.ts        # API类型定义
│   ├── user.ts         # 用户相关API
│   ├── dashboard.ts    # 仪表盘API
│   └── http.ts         # HTTP客户端配置
├── components/          # 组件层
│   ├── common/         # 通用组件
│   ├── layout/         # 布局组件
│   └── business/       # 业务组件
├── stores/             # 状态管理
│   ├── user.ts         # 用户状态
│   ├── dashboard.ts    # 仪表盘状态
│   └── global.ts       # 全局状态
├── views/              # 页面组件
│   ├── Dashboard.vue   # 仪表盘
│   ├── UserManagement.vue # 用户管理
│   └── UserDetail.vue  # 用户详情
├── router/             # 路由配置
├── styles/             # 样式文件
│   ├── theme.ts        # 主题配置
│   └── global.css      # 全局样式
├── utils/              # 工具函数
└── mock/               # Mock数据
```

#### 1. 路由配置与页面创建 (优先级: 高)

```bash
src/router/index.ts                     # 路由配置
src/views/Dashboard.vue                 # 仪表盘页面
src/views/UserManagement.vue           # 用户管理页面
src/views/UserDetail.vue               # 用户详情页面
```

#### 2. Pinia状态管理设置 (优先级: 高)

```bash
src/stores/global.ts                    # 全局状态 (主题、加载状态)
src/stores/user.ts                      # 用户状态管理
src/stores/dashboard.ts                 # 仪表盘状态
```

#### 3. 仪表盘页面开发 (优先级: 高)

```bash
src/components/business/StatsCard.vue         # 统计卡片
src/components/common/ChartComponent.vue      # 图表组件 (基于ECharts)
```

**功能要求**:

- [ ] 4个统计卡片 (收入、用户、实例、增长率)
- [ ] 收入趋势图表
- [ ] 用户增长图表
- [ ] 实例使用率图表
- [ ] 数据自动刷新功能

#### 4. 用户管理模块开发 (优先级: 高)

```bash
src/components/business/UserTable.vue         # 用户列表表格
src/components/business/UserDetailCard.vue    # 用户详情卡片
```

**功能要求**:

- [ ] 用户列表 (搜索、筛选、分页)
- [ ] 用户创建/编辑表单（已完成 UserFormModal.vue）
- [ ] 用户详情查看
- [ ] 批量操作 (删除、状态修改)
- [ ] 用户状态管理 (启用/禁用)

### 🔧 技术配置和优化

#### 5. 环境变量配置

```bash
.env.development                        # 开发环境配置
.env.production                         # 生产环境配置
```

#### 6. 通用组件开发

```bash
src/components/common/LoadingSpinner.vue      # 全局加载组件
src/components/common/ErrorBoundary.vue       # 错误边界组件
src/components/common/EmptyState.vue          # 空状态组件
```

#### 7. 工具函数和常量

```bash
src/utils/format.ts                           # 格式化工具函数
src/utils/validate.ts                         # 表单验证工具
src/constants/index.ts                        # 全局常量定义
```

### ⚡ 性能和体验优化

- [ ] 路由级别代码分割
- [ ] 组件懒加载
- [ ] 图表库按需加载
- [ ] 移动端适配 (平板模式)
- [ ] 小屏幕下的侧边栏行为
- [ ] 表格的响应式设计

### 🎨 UI/UX完善

- [ ] 按钮点击反馈动画
- [ ] 页面切换过渡动画
- [ ] 表格行悬停效果
- [ ] 表单验证实时反馈
- [ ] 图表主题适配

---

## 开发指南

### 🚀 快速启动指南

#### 立即可以开始的工作 (按优先级排序)

1. **配置基础路由** (30分钟)

   ```typescript
   // 更新router/index.ts，添加基础路由
   ```

2. **创建Pinia状态** (45分钟)

   ```typescript
   // 创建全局状态、用户状态、仪表盘状态
   ```

3. **创建仪表盘页面骨架** (45分钟)

   ```vue
   <!-- 包含4个统计卡片的布局 -->
   ```

4. **实现统计卡片组件** (60分钟)

   ```vue
   <!-- 展示统计数据的卡片组件 -->
   ```

5. **创建用户管理页面** (90分钟)

   ```vue
   <!-- 用户列表表格和搜索功能 -->
   ```

```bash
# 安装依赖
yarn

# 启动开发服务器
yarn dev

# 类型检查
npm run type-check

# 代码格式化
npm run lint

# 构建生产版本
npm run build
or
yarn build
```
