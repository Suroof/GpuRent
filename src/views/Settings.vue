<template>
  <div class="settings">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">系统设置</h1>
      <p class="page-description">管理系统配置和平台参数</p>
    </div>

    <div class="settings-content">
      <!-- 左侧导航 -->
      <div class="settings-nav">
        <NMenu :value="activeTab" :options="menuOptions" @update:value="handleTabChange" />
      </div>

      <!-- 右侧内容 -->
      <div class="settings-main">
        <!-- 基础配置 -->
        <div v-if="activeTab === 'basic'" class="setting-section">
          <NCard title="基础配置">
            <div class="form-section">
              <NForm
                ref="basicFormRef"
                :model="basicConfig"
                :rules="basicRules"
                label-placement="left"
                label-width="120px"
              >
                <NFormItem label="平台名称" path="platformName">
                  <NInput v-model:value="basicConfig.platformName" placeholder="请输入平台名称" />
                </NFormItem>

                <NFormItem label="平台描述" path="platformDesc">
                  <NInput
                    v-model:value="basicConfig.platformDesc"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入平台描述"
                  />
                </NFormItem>

                <NFormItem label="联系邮箱" path="contactEmail">
                  <NInput v-model:value="basicConfig.contactEmail" placeholder="请输入联系邮箱" />
                </NFormItem>

                <NFormItem label="客服电话" path="supportPhone">
                  <NInput v-model:value="basicConfig.supportPhone" placeholder="请输入客服电话" />
                </NFormItem>

                <NFormItem label="维护模式" path="maintenanceMode">
                  <NSwitch v-model:value="basicConfig.maintenanceMode" />
                  <span class="switch-desc">开启后用户将无法访问平台</span>
                </NFormItem>
              </NForm>

              <div class="form-actions">
                <NButton type="primary" @click="handleSaveBasic">保存配置</NButton>
                <NButton @click="handleResetBasic">重置</NButton>
              </div>
            </div>
          </NCard>
        </div>

        <!-- 费率管理 -->
        <div v-if="activeTab === 'rates'" class="setting-section">
          <NCard title="GPU费率管理">
            <div class="rate-section">
              <div class="section-header">
                <h3>GPU类型费率配置</h3>
                <NButton type="primary" @click="handleAddRate">
                  <template #icon>
                    <NIcon><Add /></NIcon>
                  </template>
                  添加费率
                </NButton>
              </div>

              <NDataTable
                :columns="rateColumns"
                :data="rateConfigs"
                :pagination="false"
                :bordered="false"
              />
            </div>
          </NCard>
        </div>

        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="setting-section">
          <NCard title="安全设置">
            <div class="form-section">
              <NForm
                ref="securityFormRef"
                :model="securityConfig"
                :rules="securityRules"
                label-placement="left"
                label-width="120px"
              >
                <NFormItem label="密码复杂度" path="passwordComplexity">
                  <NSelect
                    v-model:value="securityConfig.passwordComplexity"
                    :options="passwordOptions"
                    placeholder="请选择密码复杂度"
                  />
                </NFormItem>

                <NFormItem label="登录失败次数" path="maxLoginAttempts">
                  <NInputNumber
                    v-model:value="securityConfig.maxLoginAttempts"
                    :min="3"
                    :max="10"
                    placeholder="登录失败次数限制"
                  />
                </NFormItem>

                <NFormItem label="会话超时" path="sessionTimeout">
                  <NInputNumber
                    v-model:value="securityConfig.sessionTimeout"
                    :min="30"
                    :max="480"
                    placeholder="会话超时时间（分钟）"
                  />
                </NFormItem>

                <NFormItem label="启用2FA" path="enable2FA">
                  <NSwitch v-model:value="securityConfig.enable2FA" />
                  <span class="switch-desc">启用双因子认证</span>
                </NFormItem>
              </NForm>

              <div class="form-actions">
                <NButton type="primary" @click="handleSaveSecurity">保存配置</NButton>
                <NButton @click="handleResetSecurity">重置</NButton>
              </div>
            </div>
          </NCard>
        </div>

        <!-- 系统监控 -->
        <div v-if="activeTab === 'monitor'" class="setting-section">
          <NCard title="系统监控">
            <div class="monitor-section">
              <div class="monitor-stats">
                <div class="stat-item">
                  <div class="stat-label">系统运行时间</div>
                  <div class="stat-value">{{ systemStats.uptime }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">CPU使用率</div>
                  <div class="stat-value">{{ systemStats.cpuUsage }}%</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">内存使用率</div>
                  <div class="stat-value">{{ systemStats.memoryUsage }}%</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">磁盘使用率</div>
                  <div class="stat-value">{{ systemStats.diskUsage }}%</div>
                </div>
              </div>

              <div class="monitor-actions">
                <NButton @click="handleRefreshStats">
                  <template #icon>
                    <NIcon><Refresh /></NIcon>
                  </template>
                  刷新状态
                </NButton>
                <NButton type="warning" @click="handleClearLogs">
                  <template #icon>
                    <NIcon><TrashBin /></NIcon>
                  </template>
                  清理日志
                </NButton>
              </div>
            </div>
          </NCard>
        </div>
      </div>
    </div>

    <!-- 费率编辑弹窗 -->
    <NModal v-model:show="rateModalVisible" preset="dialog" title="编辑费率">
      <NForm
        ref="rateFormRef"
        :model="editingRate"
        :rules="rateRules"
        label-placement="left"
        label-width="80px"
      >
        <NFormItem label="GPU类型" path="type">
          <NInput v-model:value="editingRate.type" placeholder="如：RTX4090" />
        </NFormItem>
        <NFormItem label="每小时费率" path="hourlyRate">
          <NInputNumber
            v-model:value="editingRate.hourlyRate"
            :min="1"
            :precision="2"
            placeholder="费率（元/小时）"
          />
        </NFormItem>
        <NFormItem label="描述" path="description">
          <NInput
            v-model:value="editingRate.description"
            type="textarea"
            placeholder="GPU描述信息"
          />
        </NFormItem>
      </NForm>

      <template #action>
        <NSpace>
          <NButton @click="rateModalVisible = false">取消</NButton>
          <NButton type="primary" @click="handleSaveRate">保存</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h, onMounted } from 'vue'
import {
  NCard,
  NMenu,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NButton,
  NIcon,
  NDataTable,
  NModal,
  NSpace,
  useMessage,
  type DataTableColumns,
  type FormRules
} from 'naive-ui'
import {
  Add,
  Refresh,
  TrashBin,
  Settings as SettingsIcon,
  Shield as SecurityIcon,
  TrendingUp as RateIcon,
  Analytics as MonitorIcon
} from '@vicons/ionicons5'

const message = useMessage()

// 当前激活的标签页
const activeTab = ref('basic')

// 左侧菜单配置
const menuOptions = [
  {
    label: '基础配置',
    key: 'basic',
    icon: () => h(NIcon, null, { default: () => h(SettingsIcon) })
  },
  {
    label: '费率管理',
    key: 'rates',
    icon: () => h(NIcon, null, { default: () => h(RateIcon) })
  },
  {
    label: '安全设置',
    key: 'security',
    icon: () => h(NIcon, null, { default: () => h(SecurityIcon) })
  },
  {
    label: '系统监控',
    key: 'monitor',
    icon: () => h(NIcon, null, { default: () => h(MonitorIcon) })
  }
]

// 基础配置
const basicConfig = reactive({
  platformName: 'GPU云算力平台',
  platformDesc: '专业的GPU云计算服务平台，提供高性能GPU实例租借服务',
  contactEmail: 'support@gpu-cloud.com',
  supportPhone: '400-888-9999',
  maintenanceMode: false
})

const basicRules: FormRules = {
  platformName: [{ required: true, message: '请输入平台名称', trigger: 'blur' }],
  contactEmail: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 费率配置
const rateConfigs = ref([
  { id: 1, type: 'RTX3080', hourlyRate: 8, description: '适合深度学习训练' },
  { id: 2, type: 'RTX3090', hourlyRate: 12, description: '高性能训练和推理' },
  { id: 3, type: 'RTX4090', hourlyRate: 20, description: '最新架构，极致性能' },
  { id: 4, type: 'A100', hourlyRate: 50, description: '企业级AI加速卡' }
])

const rateColumns: DataTableColumns = [
  { title: 'GPU类型', key: 'type', width: 120 },
  { title: '费率（元/小时）', key: 'hourlyRate', width: 120 },
  { title: '描述', key: 'description', ellipsis: { tooltip: true } },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    render: (row: any) => [
      h(NButton, { size: 'small', onClick: () => handleEditRate(row) }, { default: () => '编辑' }),
      h(
        NButton,
        {
          size: 'small',
          type: 'error',
          style: 'margin-left: 8px',
          onClick: () => handleDeleteRate(row.id)
        },
        { default: () => '删除' }
      )
    ]
  }
]

// 费率编辑
const rateModalVisible = ref(false)
const editingRate = reactive({
  id: null,
  type: '',
  hourlyRate: 0,
  description: ''
})

const rateRules: FormRules = {
  type: [{ required: true, message: '请输入GPU类型', trigger: 'blur' }],
  hourlyRate: [{ required: true, type: 'number', message: '请输入费率', trigger: 'blur' }]
}

// 安全配置
const securityConfig = reactive({
  passwordComplexity: 'medium',
  maxLoginAttempts: 5,
  sessionTimeout: 120,
  enable2FA: false
})

const passwordOptions = [
  { label: '低（6位以上）', value: 'low' },
  { label: '中（8位字母数字）', value: 'medium' },
  { label: '高（8位字母数字符号）', value: 'high' }
]

const securityRules: FormRules = {
  maxLoginAttempts: [
    { required: true, type: 'number', message: '请设置登录失败次数', trigger: 'blur' }
  ],
  sessionTimeout: [
    { required: true, type: 'number', message: '请设置会话超时时间', trigger: 'blur' }
  ]
}

// 系统监控
const systemStats = reactive({
  uptime: '15天3小时',
  cpuUsage: 25,
  memoryUsage: 68,
  diskUsage: 45
})

// 表单引用
const basicFormRef = ref()
const securityFormRef = ref()
const rateFormRef = ref()

// 标签页切换
const handleTabChange = (key: string) => {
  activeTab.value = key
}

// 基础配置保存
const handleSaveBasic = async () => {
  try {
    await basicFormRef.value?.validate()
    // 这里应该调用API保存配置
    message.success('基础配置保存成功')
  } catch (error) {
    message.error('请检查表单输入')
  }
}

const handleResetBasic = () => {
  basicConfig.platformName = 'GPU云算力平台'
  basicConfig.platformDesc = '专业的GPU云计算服务平台，提供高性能GPU实例租借服务'
  basicConfig.contactEmail = 'support@gpu-cloud.com'
  basicConfig.supportPhone = '400-888-9999'
  basicConfig.maintenanceMode = false
}

// 费率管理
const handleAddRate = () => {
  editingRate.id = null
  editingRate.type = ''
  editingRate.hourlyRate = 0
  editingRate.description = ''
  rateModalVisible.value = true
}

const handleEditRate = (row: any) => {
  editingRate.id = row.id
  editingRate.type = row.type
  editingRate.hourlyRate = row.hourlyRate
  editingRate.description = row.description
  rateModalVisible.value = true
}

const handleSaveRate = async () => {
  try {
    await rateFormRef.value?.validate()

    if (editingRate.id) {
      // 编辑
      const index = rateConfigs.value.findIndex((r) => r.id === editingRate.id)
      if (index !== -1) {
        rateConfigs.value[index] = { ...editingRate }
      }
    } else {
      // 新增
      const newId = Math.max(...rateConfigs.value.map((r) => r.id)) + 1
      rateConfigs.value.push({ ...editingRate, id: newId })
    }

    rateModalVisible.value = false
    message.success('费率配置保存成功')
  } catch (error) {
    message.error('请检查表单输入')
  }
}

const handleDeleteRate = (id: number) => {
  const index = rateConfigs.value.findIndex((r) => r.id === id)
  if (index !== -1) {
    rateConfigs.value.splice(index, 1)
    message.success('费率配置删除成功')
  }
}

// 安全配置保存
const handleSaveSecurity = async () => {
  try {
    await securityFormRef.value?.validate()
    message.success('安全配置保存成功')
  } catch (error) {
    message.error('请检查表单输入')
  }
}

const handleResetSecurity = () => {
  securityConfig.passwordComplexity = 'medium'
  securityConfig.maxLoginAttempts = 5
  securityConfig.sessionTimeout = 120
  securityConfig.enable2FA = false
}

// 系统监控
const handleRefreshStats = () => {
  systemStats.cpuUsage = Math.floor(Math.random() * 50) + 20
  systemStats.memoryUsage = Math.floor(Math.random() * 40) + 50
  systemStats.diskUsage = Math.floor(Math.random() * 30) + 30
  message.success('系统状态已刷新')
}

const handleClearLogs = () => {
  message.success('系统日志已清理')
}

// 页面初始化
onMounted(() => {
  // 可以在这里加载配置数据
})
</script>

<style scoped>
.settings {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.settings-content {
  display: flex;
  gap: 24px;
  min-height: 600px;
}

.settings-nav {
  width: 200px;
  flex-shrink: 0;
}

.settings-main {
  flex: 1;
}

.setting-section {
  width: 100%;
}

.form-section {
  max-width: 600px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.switch-desc {
  margin-left: 12px;
  color: #6b7280;
  font-size: 14px;
}

.rate-section {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.monitor-section {
  width: 100%;
}

.monitor-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.monitor-actions {
  display: flex;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .settings-content {
    flex-direction: column;
  }

  .settings-nav {
    width: 100%;
    margin-bottom: 24px;
  }

  .settings-main {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .settings {
    padding: 0;
  }

  .page-header {
    padding: 16px;
    margin-bottom: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .settings-content {
    margin: 0 16px;
    gap: 16px;
  }

  .settings-nav :deep(.n-menu) {
    flex-direction: row;
    overflow-x: auto;
  }

  .form-section {
    gap: 16px;
  }

  .monitor-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .monitor-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }

  .page-description {
    font-size: 12px;
  }

  .settings-content {
    margin: 0 12px;
  }

  .monitor-stats {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>
