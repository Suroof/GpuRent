<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape1"></div>
        <div class="shape shape2"></div>
        <div class="shape shape3"></div>
        <div class="shape shape4"></div>
      </div>
    </div>

    <div class="login-content">
      <!-- 左侧登录表单 -->
      <div class="login-box">
        <div class="login-header">
          <div class="logo-area">
            <div class="logo-icon">
              <img src="@/assets/img/logo.svg" alt="" />
            </div>
            <h1>登录</h1>
          </div>
          <p>请登录您的管理账户</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>用户名</label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input
                type="text"
                v-model="form.username"
                placeholder="请输入用户名"
                required
                @focus="onInputFocus"
                @blur="onInputBlur"
              />
            </div>
          </div>

          <div class="form-group">
            <label>密码</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                placeholder="请输入密码"
                required
                @focus="onInputFocus"
                @blur="onInputBlur"
              />
              <i
                :class="['password-toggle', 'fas', showPassword ? 'fa-eye-slash' : 'fa-eye']"
                @click="togglePassword"
              ></i>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="form.remember" />
              <span class="checkmark"></span>
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>

          <button type="submit" class="login-button" :class="{ loading: isLoading }">
            <span v-if="!isLoading">登录</span>
            <span v-else class="loading-text">
              <i class="fas fa-spinner fa-spin"></i>
              登录中...
            </span>
          </button>
        </form>
      </div>

      <!-- 右侧3D模型区域 -->
      <div class="model-area">
        <div class="model-container">
          <!-- 3D立方体模型 -->
          <div class="cube-3d">
            <div class="face front">
              <div class="face-content">
                <i class="fas fa-chart-line"></i>
                <span>数据分析</span>
              </div>
            </div>
            <div class="face back">
              <div class="face-content">
                <i class="fas fa-users"></i>
                <span>用户管理</span>
              </div>
            </div>
            <div class="face right">
              <div class="face-content">
                <i class="fas fa-cog"></i>
                <span>系统设置</span>
              </div>
            </div>
            <div class="face left">
              <div class="face-content">
                <i class="fas fa-shield-alt"></i>
                <span>安全防护</span>
              </div>
            </div>
            <div class="face top">
              <div class="face-content">
                <i class="fas fa-rocket"></i>
                <span>高性能</span>
              </div>
            </div>
            <div class="face bottom">
              <div class="face-content">
                <i class="fas fa-database"></i>
                <span>数据存储</span>
              </div>
            </div>
          </div>

          <!-- 装饰性几何图形 -->
          <div class="geometric-shapes">
            <div class="geo-shape geo1"></div>
            <div class="geo-shape geo2"></div>
            <div class="geo-shape geo3"></div>
          </div>
        </div>

        <div class="model-text">
          <h2>现代化后台管理</h2>
          <p>Easy to use</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const onInputFocus = (event: FocusEvent) => {
  const wrapper = (event.target as HTMLElement).closest('.input-wrapper')
  wrapper?.classList.add('focused')
}

const onInputBlur = (event: FocusEvent) => {
  const wrapper = (event.target as HTMLElement).closest('.input-wrapper')
  wrapper?.classList.remove('focused')
}

const handleLogin = async () => {
  try {
    isLoading.value = true
    console.log('登录信息：', form)

    // 模拟登录延迟
    await new Promise((resolve) => setTimeout(resolve, 1500))

    await router.push({ name: 'dashboard' })
  } catch (error) {
    console.error('登录失败：', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 主容器样式 */
.login-container {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #0f0f0f 0%,
    #1a1a1a 25%,
    #2d2d2d 50%,
    #1a1a1a 75%,
    #0f0f0f 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  animation: float 20s infinite;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.shape1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}

.shape3 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}

.shape4 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 30%;
  animation-delay: -15s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
  }
  75% {
    transform: translateY(-20px) rotate(270deg);
  }
}

/* 主内容区域 */
.login-content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px;
  gap: 60px;
}

/* 登录表单区域 */
.login-box {
  flex: 1;
  max-width: 450px;
  height: 552px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 48px;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  animation: slideInLeft 0.8s ease-out;
  margin-left: 100px;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 登录头部 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #333333, #555555);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.logo-icon i {
  color: white;
  font-size: 20px;
}

.login-header h1 {
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(135deg, #ffffff, #e5e5e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  color: #b0b0b0;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

/* 表单样式 */
.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #e5e5e5;
  font-weight: 500;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
}

.input-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #ffffff;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-wrapper.focused::after {
  width: 100%;
}

.input-wrapper i {
  position: absolute;
  left: 16px;
  color: #777777;
  font-size: 16px;
  transition: all 0.3s ease;
  z-index: 2;
}

.input-wrapper.focused i {
  color: #ffffff;
  transform: scale(1.1) translateY(-1px);
}

.input-wrapper input {
  width: 100%;
  padding: 16px 0 12px 48px;
  border: 0;
  border-bottom: 1px solid #444444;
  border-radius: 0;
  font-size: 16px;
  background: transparent;
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  box-shadow: none;
}

.input-wrapper input:focus {
  border-bottom-color: #ffffff;
  background: transparent;
  box-shadow: none;
  transform: none;
}

.input-wrapper input::placeholder {
  color: #777777;
  transition: all 0.3s ease;
  font-weight: 300;
}

.input-wrapper input:focus::placeholder {
  color: #999999;
  transform: translateY(-2px);
  font-size: 14px;
}

.password-toggle {
  right: 16px !important;
  left: auto !important;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.password-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #e5e5e5;
  gap: 8px;
}

.remember-me input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #666666;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.remember-me input[type='checkbox']:checked + .checkmark {
  background: #ffffff;
  border-color: #ffffff;
}

.remember-me input[type='checkbox']:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #000000;
  font-size: 12px;
  font-weight: bold;
}

.forgot-password {
  color: #cccccc;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.forgot-password:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
  color: #000000;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 12px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #f5f5f5 0%, #d5d5d5 100%);
}

.login-button:hover::before {
  left: 100%;
}

.login-button:active {
  transform: translateY(0);
}

.login-button.loading {
  pointer-events: none;
  opacity: 0.8;
}

.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-text i {
  font-size: 14px;
}

/* 分割线 */
.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #444444;
}

.divider span {
  background: rgba(20, 20, 20, 0.95);
  padding: 0 16px;
  color: #888888;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

/* 社交登录 */
.social-login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid #444444;
  border-radius: 8px;
  background: #2a2a2a;
  color: #e5e5e5;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  border-color: #666666;
  background: #333333;
  transform: translateY(-1px);
}

.social-btn.google:hover {
  border-color: #ffffff;
  color: #ffffff;
}

.social-btn.github:hover {
  border-color: #ffffff;
  color: #ffffff;
}

/* 注册链接 */
.signup-link {
  text-align: center;
  font-size: 14px;
  color: #888888;
  margin: 0;
}

.signup-link a {
  color: #cccccc;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.signup-link a:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* 3D模型区域 */
.model-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: slideInRight 0.8s ease-out 0.2s both;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.model-container {
  position: relative;
  width: 300px;
  height: 300px;
  margin-bottom: 40px;
  perspective: 1000px;
}

/* 3D立方体 */
.cube-3d {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: rotate3D 20s infinite linear;
  margin: 50px auto;
}

@keyframes rotate3D {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: rotateX(90deg) rotateY(90deg);
  }
  50% {
    transform: rotateX(180deg) rotateY(180deg);
  }
  75% {
    transform: rotateX(270deg) rotateY(270deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}

.face {
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.face-content {
  text-align: center;
}

.face-content i {
  display: block;
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.front {
  transform: rotateY(0deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(80, 80, 80, 0.8), rgba(60, 60, 60, 0.8));
}
.back {
  transform: rotateY(180deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(120, 120, 120, 0.8), rgba(100, 100, 100, 0.8));
}
.right {
  transform: rotateY(90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(160, 160, 160, 0.8), rgba(140, 140, 140, 0.8));
}
.left {
  transform: rotateY(-90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(100, 100, 100, 0.8), rgba(80, 80, 80, 0.8));
}
.top {
  transform: rotateX(90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(200, 200, 200, 0.8), rgba(180, 180, 180, 0.8));
}
.bottom {
  transform: rotateX(-90deg) translateZ(100px);
  background: linear-gradient(135deg, rgba(40, 40, 40, 0.8), rgba(20, 20, 20, 0.8));
}

/* 装饰性几何图形 */
.geometric-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.geo-shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.geo1 {
  width: 40px;
  height: 40px;
  top: 20%;
  left: 10%;
  animation: float 15s infinite;
}

.geo2 {
  width: 60px;
  height: 60px;
  top: 70%;
  right: 20%;
  animation: float 18s infinite reverse;
}

.geo3 {
  width: 30px;
  height: 30px;
  bottom: 30%;
  left: 80%;
  animation: float 12s infinite;
}

/* 模型文本区域 */
.model-text {
  text-align: center;
  color: white;
  max-width: 400px;
}

.model-text h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ffffff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.model-text p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
/* 响应式设计 */
@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
    gap: 40px;
    padding: 20px;
  }

  .model-area {
    order: -1;
    padding: 20px;
  }

  .model-container {
    width: 200px;
    height: 200px;
  }

  .cube-3d {
    width: 150px;
    height: 150px;
  }

  .face {
    width: 150px;
    height: 150px;
  }

  .front {
    transform: rotateY(0deg) translateZ(75px);
  }
  .back {
    transform: rotateY(180deg) translateZ(75px);
  }
  .right {
    transform: rotateY(90deg) translateZ(75px);
  }
  .left {
    transform: rotateY(-90deg) translateZ(75px);
  }
  .top {
    transform: rotateX(90deg) translateZ(75px);
  }
  .bottom {
    transform: rotateX(-90deg) translateZ(75px);
  }
}

@media (max-width: 768px) {
  .login-box {
    padding: 32px 24px;
    max-width: 100%;
  }

  .social-login {
    grid-template-columns: 1fr;
  }

  .model-text h2 {
    font-size: 24px;
  }

  .model-text p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .login-content {
    padding: 16px;
  }

  .login-box {
    padding: 24px 16px;
  }

  .login-header h1 {
    font-size: 24px;
  }

  .model-container {
    width: 150px;
    height: 150px;
  }

  .cube-3d {
    width: 100px;
    height: 100px;
  }

  .face {
    width: 100px;
    height: 100px;
    font-size: 12px;
  }

  .face-content i {
    font-size: 20px;
  }

  .front {
    transform: rotateY(0deg) translateZ(50px);
  }
  .back {
    transform: rotateY(180deg) translateZ(50px);
  }
  .right {
    transform: rotateY(90deg) translateZ(50px);
  }
  .left {
    transform: rotateY(-90deg) translateZ(50px);
  }
  .top {
    transform: rotateX(90deg) translateZ(50px);
  }
  .bottom {
    transform: rotateX(-90deg) translateZ(50px);
  }
}
</style>
