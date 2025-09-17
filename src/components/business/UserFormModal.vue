<template>
  <NModal v-model:show="visible" preset="dialog" title="用户表单">
    <template #header>
      <div>{{ isEdit ? '编辑用户' : '添加用户' }}</div>
    </template>

    <NForm ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80px">
      <NFormItem label="用户名" path="username">
        <NInput v-model:value="formData.username" placeholder="请输入用户名" />
      </NFormItem>

      <NFormItem label="邮箱" path="email">
        <NInput v-model:value="formData.email" placeholder="请输入邮箱" />
      </NFormItem>

      <NFormItem v-if="!isEdit" label="密码" path="password">
        <NInput v-model:value="formData.password" type="password" placeholder="请输入密码" />
      </NFormItem>

      <NFormItem label="姓名" path="realName">
        <NInput v-model:value="formData.realName" placeholder="请输入真实姓名" />
      </NFormItem>

      <NFormItem label="手机号" path="phone">
        <NInput v-model:value="formData.phone" placeholder="请输入手机号" />
      </NFormItem>

      <NFormItem label="角色" path="role">
        <NSelect v-model:value="formData.role" :options="roleOptions" placeholder="请选择角色" />
      </NFormItem>

      <NFormItem v-if="isEdit" label="状态" path="status">
        <NSelect
          v-model:value="formData.status"
          :options="statusOptions"
          placeholder="请选择状态"
        />
      </NFormItem>
    </NForm>

    <template #action>
      <NSpace>
        <NButton @click="handleCancel">取消</NButton>
        <NButton type="primary" :loading="submitting" @click="handleSubmit">
          {{ isEdit ? '更新' : '创建' }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NSpace,
  useMessage,
  type FormInst,
  type FormRules
} from 'naive-ui'
import { UserAPI } from '@/api/user'
import type { User, CreateUserData, UpdateUserData } from '@/api/types'

interface Props {
  visible: boolean
  user?: User | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  success: []
}>()

const message = useMessage()
const formRef = ref<FormInst>()
const submitting = ref(false)

// 计算属性
const isEdit = computed(() => !!props.user)

// 表单数据
const formData = ref({
  username: '',
  email: '',
  password: '',
  realName: '',
  phone: '',
  role: 'user' as 'admin' | 'user',
  status: 'active' as 'active' | 'inactive'
})

// 选项配置
const roleOptions = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' }
]

const statusOptions = [
  { label: '活跃', value: 'active' },
  { label: '禁用', value: 'inactive' }
]

// 表单验证规则
const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: ['blur']
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: ['blur'],
    type: 'email'
  },
  password: {
    required: !isEdit.value,
    message: '请输入密码',
    trigger: ['blur'],
    min: 6
  },
  role: {
    required: true,
    message: '请选择角色',
    trigger: ['change']
  }
}

// 监听用户数据变化
watch(
  () => props.user,
  (user) => {
    if (user) {
      formData.value = {
        username: user.username,
        email: user.email,
        password: '',
        realName: user.realName || '',
        phone: user.phone || '',
        role: user.role,
        status: user.status
      }
    } else {
      // 重置表单
      formData.value = {
        username: '',
        email: '',
        password: '',
        realName: '',
        phone: '',
        role: 'user',
        status: 'active'
      }
    }
  },
  { immediate: true }
)

// 取消操作
const handleCancel = () => {
  emit('update:visible', false)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    submitting.value = true

    if (isEdit.value && props.user) {
      // 更新用户
      const updateData: UpdateUserData = {
        username: formData.value.username,
        email: formData.value.email,
        realName: formData.value.realName || undefined,
        phone: formData.value.phone || undefined,
        role: formData.value.role,
        status: formData.value.status
      }

      await UserAPI.updateUser(props.user.id, updateData)
      message.success('用户更新成功')
    } else {
      // 创建用户
      const createData: CreateUserData = {
        username: formData.value.username,
        email: formData.value.email,
        password: formData.value.password,
        realName: formData.value.realName || undefined,
        phone: formData.value.phone || undefined,
        role: formData.value.role
      }

      await UserAPI.createUser(createData)
      message.success('用户创建成功')
    }

    emit('success')
  } catch (error) {
    message.error(isEdit.value ? '用户更新失败' : '用户创建失败')
    console.error('Form submit error:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
:deep(.n-form-item-label) {
  font-weight: 500;
}
</style>
