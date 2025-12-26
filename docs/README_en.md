# <p align="center">🤖 LLM Playground 🚀✨</p>

<p align="center">A powerful and interactive experimental platform for experimenting with large language models, built based on Next.js 14 and modern web technologies.</p>

<p align="center">This project is a derivative work based on <a href="https://github.com/302ai/302_llm_playground" target="_blank">302ai/302_llm_playground</a></p>

<p align="center"><a href="https://302.ai/en/apis/" target="blank"><img src="https://file.302.ai/gpt/imgs/github/20250102/72a57c4263944b73bf521830878ae39a.png" /></a></p >

<p align="center"><a href="../README.md">中文</a> | <a href="README_en.md">English</a> | <a href="README_ja.md">日本語</a> | <a href="README_ru.md">Русский</a> | <a href="README_fr.md">Français</a> | <a href="README_de.md">Deutsch</a></p>



![界面预览](https://cnb.mizhoubaobei.top/302_llm_playground/302-LLM-游乐场en.png)

## Interface Preview 
   Generate results based on user input, supporting Latex expression rendering.
   ![Results Generation](https://cnb.mizhoubaobei.top/302_llm_playground/LLM英1.png)    

   Images can be uploaded as context for dialogue.
   ![Image Upload](https://cnb.mizhoubaobei.top/302_llm_playground/LLM英2.png)    

   Support chart rendering.
   ![Chart Rendering](https://cnb.mizhoubaobei.top/302_llm_playground/LLM英3.png)    

   The OpenAI model has the function of displaying token probabilities. It can obtain the probability of the currently selected token and provide multiple alternative tokens as well as their probabilities.
   ![Token Probability Display](https://cnb.mizhoubaobei.top/302_llm_playground/LLM英4.jpg)


## ✨ Key Features ✨

1. **Interactive Chat Interface**
   - Real-time markdown editing and preview
   - Role-based conversations
   - Users can upload images for conversation.
   - Under the OpenAI model, token probabilities can be displayed.
   - Advanced message manipulation: reorder, copy, regenerate
   - Expert Mode: enhanced editing and role controls
   - Feedback and animations for seamless UX
   - Model configuration and AI parameter tuning
   - Responsive and accessible design

2. **Rich Text Editor**
   - Advanced markdown with GitHub Flavored support
   - KaTeX for LaTeX expressions
   - Mermaid for diagram rendering
   - Persistent content and live rendering


3. **Modern User Experience**
   - Customizable and responsive UI
   - Animations, notifications, and error handling
   - Mobile-friendly with accessible components

4. **Advanced Features**
   - IndexedDB persistence, multiple language support
   - API integration and message history management
   - Advanced logging and optimized API handling
   - Internationalization and dynamic translations

## Tech Stack 🛠️

- **Framework**: Next.js 14
- **Languages**: TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Jotai
- **Data Storage**: IndexedDB with Dexie.js
- **Internationalization**: next-intl

## Project Structure 📁

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

## Getting Started 🚀

### Prerequisites

- Node.js (LTS version)
- pnpm or npm
- 302.AI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/302ai/302_llm_playground
   cd 302_llm_playground
   ```
   
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

   - `AI_302_API_KEY`: Your 302.AI API key
   - `AI_302_API_URL`: API endpoint

### Development

Start the development server:

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
pnpm build
pnpm start
```

## Docker Deployment 🐳

### Using Pre-built Images

- **DockerHub**: `qixiaoxin/iflow-cartoonize-api`
- **GitHub Container Registry**: `ghcr.io/xiaomizhoubaobei/llm_playground`
- **Alibaba Cloud**: `crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground`
- **Huawei Cloud**: `swr.cn-east-3.myhuaweicloud.com/qixiaoxin/llm_playground`

```bash
# Using DockerHub image
docker pull qixiaoxin/iflow-cartoonize-api:latest
docker run -p 3000:3000 qixiaoxin/iflow-cartoonize-api:latest

# Using GHCR image
docker pull ghcr.io/xiaomizhoubaobei/llm_playground:latest
docker run -p 3000:3000 ghcr.io/xiaomizhoubaobei/llm_playground:latest

# Using Alibaba Cloud image
docker pull crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground:latest
docker run -p 3000:3000 crpi-wk2d8umombj539de.cn-shanghai.personal.cr.aliyuncs.com/xmz-1/302_llm_playground:latest

# Using Huawei Cloud image
docker pull swr.cn-east-3.myhuaweicloud.com/qixiaoxin/llm_playground:latest
docker run -p 3000:3000 swr.cn-east-3.myhuaweicloud.com/qixiaoxin/llm_playground:latest
```

### Build from Source

```bash
docker build -t llm_playground .
docker run -p 3000:3000 llm_playground
```

### Runtime Environment Variables

⚠️ **Important**: The Docker image requires a real 302.AI API key to function properly at runtime.

```bash
docker run -d \
  -e AI_302_API_KEY=your-actual-api-key \
  -e AI_302_API_URL=https://api.302.ai \
  -e NEXT_PUBLIC_AI_302_API_UPLOAD_URL=https://dash-api.302.ai/gpt/api/upload/gpt/image \
  -p 3000:3000 \
  llm_playground:latest
```

**Environment Variables:**

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_302_API_KEY` | 302.AI API key | ✅ Yes |
| `AI_302_API_URL` | API service URL | ✅ Yes |
| `NEXT_PUBLIC_AI_302_API_UPLOAD_URL` | File upload URL | ✅ Yes |

Get API key: https://302.ai/en/apis/

## Contributing 🤝

Contributions are welcome! Please feel free to submit issues and pull requests.

## License 📜

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

---

Built with ❤️ using Next.js and 302.AI
