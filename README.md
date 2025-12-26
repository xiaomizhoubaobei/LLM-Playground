# <p align="center">🤖 LLM Playground🚀✨</p>

<p align="center">一个强大且互动的实验平台，用于实验大型语言模型，基于 Next.js 14 和现代 Web 技术构建。</p>

<p align="center">本项目基于 <a href="https://github.com/302ai/302_llm_playground" target="_blank">302ai/302_llm_playground</a> 项目二创而来</p>

<p align="center"><a href="https://302.ai/apis/" target="blank"><img src="https://file.302.ai/gpt/imgs/github/20250102/72a57c4263944b73bf521830878ae39a.png" /></a></p >

<p align="center"><a href="README.md">中文</a> | <a href="docs/README_en.md">English</a> | <a href="docs/README_ja.md">日本語</a> | <a href="docs/README_ru.md">Русский</a> | <a href="docs/README_fr.md">Français</a> | <a href="docs/README_de.md">Deutsch</a></p>

![界面预览](https://cnb.mizhoubaobei.top/302_llm_playground/302-LLM-游乐场.png) 

## 界面预览
   根据用户输入生成结果，支持Latex表达式渲染。
   ![生成结果示例](https://cnb.mizhoubaobei.top/302_llm_playground/LLM1.png)     

   可上传图片作为上下文进行对话。
   ![图片上传功能](https://cnb.mizhoubaobei.top/302_llm_playground/LLM2.png)     

   支持图表渲染。
   ![图表渲染示例](https://cnb.mizhoubaobei.top/302_llm_playground/LLM3.png)

   OpenAI模型下具有显示词元概率功能，可获取当前选中词元的概率，提供多个备选词元及概率。
   ![词元概率显示](https://cnb.mizhoubaobei.top/302_llm_playground/LLM4.jpg)
   
## ✨ 主要功能 ✨

1. **互动聊天界面**
   - 实时 Markdown 编辑和预览
   - 基于角色的对话
   - 用户可上传图片用于对话
   - OpenAI模型下可显示词元概率
   - 高级消息操作：重新排序、复制、重新生成
   - 专家模式：增强的编辑和角色控制
   - 无缝用户体验的反馈和动画
   - 模型配置和 AI 参数调整
   - 响应式和可访问的设计


2. **丰富文本编辑器**
   - 支持 GitHub 风格的高级 Markdown
   - 支持 LaTeX 表达式的 KaTeX
   - 支持 Mermaid 图表渲染
   - 持久化内容和实时渲染


3. **现代用户体验**
   - 可定制和响应式的 UI
   - 动画、通知和错误处理
   - 移动友好且可访问的组件

4. **高级功能**
   - IndexedDB 持久化，多语言支持
   - API 集成和消息历史管理
   - 高级日志记录和优化的 API 处理
   - 国际化和动态翻译

## 技术栈 🛠️

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS, Radix UI
- **状态管理**: Jotai
- **数据存储**: IndexedDB with Dexie.js
- **国际化**: next-intl

## 项目结构 📁

```plaintext
src/
├── actions/
├── app/
├── components/
│   ├── playground/
│   └── ui/
├── constants/
├── db/
├── hooks/
├── i18n/
├── stores/
├── styles/
└── utils/
```

## 快速开始 🚀

### 先决条件

- Node.js (LTS 版本)
- pnpm 或 npm
- 302.AI API 密钥

### 安装

1. 克隆仓库：
   ```bash
   git clone https://github.com/302ai/302_llm_playground
   cd 302_llm_playground
   ```
   
2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 配置环境变量：
   ```bash
   cp .env.example .env.local
   ```

   - `AI_302_API_KEY`: 您的 302.AI API 密钥
   - `AI_302_API_URL`: API 端点

### 开发

启动开发服务器：

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 生产构建

```bash
pnpm build
pnpm start
```

## Docker 部署 🐳

### 使用预构建镜像

- **DockerHub**: `qixiaoxin/iflow-cartoonize-api`
- **GitHub Container Registry**: `ghcr.io/xiaomizhoubaobei/llm_playground`
- **阿里云**: `crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground`
- **华为云**: `swr.cn-east-3.myhuaweicloud.com/qixiaoxin/llm_playground`

```bash
# 使用 DockerHub 镜像
docker pull qixiaoxin/iflow-cartoonize-api:latest
docker run -p 3000:3000 qixiaoxin/iflow-cartoonize-api:latest

# 使用 GHCR 镜像
docker pull ghcr.io/xiaomizhoubaobei/llm_playground:latest
docker run -p 3000:3000 ghcr.io/xiaomizhoubaobei/llm_playground:latest

# 使用阿里云镜像
docker pull crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground:latest
docker run -p 3000:3000 crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground:latest

# 使用华为云镜像
docker pull swr.cn-east-3.myhuaweicloud.com/qixiaoxin/llm_playground:latest
docker run -p 3000:3000 swr.cn-east-3.myhuaweicloud.com/qixiaoxin/llm_playground:latest
```

### 从源码构建

```bash
docker build -t llm_playground .
docker run -p 3000:3000 llm_playground
```

### 运行时环境变量

⚠️ **重要**: Docker 镜像运行时需要传入真实的 302.AI API 密钥才能正常工作。

```bash
docker run -d \
  -e AI_302_API_KEY=your-actual-api-key \
  -e AI_302_API_URL=https://api.302.ai \
  -e NEXT_PUBLIC_AI_302_API_UPLOAD_URL=https://dash-api.302.ai/gpt/api/upload/gpt/image \
  -p 3000:3000 \
  llm_playground:latest
```

**环境变量说明：**

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `AI_302_API_KEY` | 302.AI API 密钥 | ✅ 是 |
| `AI_302_API_URL` | API 服务地址 | ✅ 是 |
| `NEXT_PUBLIC_AI_302_API_UPLOAD_URL` | 文件上传地址 | ✅ 是 |

获取 API 密钥：https://302.ai/apis/

## 贡献 🤝

欢迎贡献！请随时提交问题和拉取请求。

## 许可证 📜

本项目根据 GNU Affero General Public License v3.0 许可。详情请参阅 [LICENSE](LICENSE) 文件。

---

使用 Next.js 和 302.AI 构建 ❤️


