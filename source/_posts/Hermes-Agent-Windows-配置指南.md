---
title: 🧙 Hermes Agent Windows 配置指南 — 连接 DeepSeek 模型
date: 2026-06-05 18:30:00
tags: [Hermes Agent, AI, DeepSeek, 配置教程, Windows]
categories: 学习
cover: /images/covers/cover-4.webp
---

> 本文面向 Windows 用户，一步一步教你安装 Hermes Agent 并接入 DeepSeek 模型。如果你用的也是 DeepSeek，跟着做就能在本地用上全功能的 AI 代理。

---

## 什么是 Hermes Agent？

Hermes Agent 是 [Nous Research](https://nousresearch.com) 开发的开源 AI 代理。它不只是个聊天窗口——它能**自己写代码、操作终端、执行定时任务、创建技能、记住你是谁**。而且它不绑定某个特定模型，你可以随便换。

核心能力：
- **真正的终端交互** — 可以直接在本地跑命令、写文件、调试代码
- **跨平台通信** — 同一个代理可以同时在 Telegram / Discord / 微信 / CLI 上聊天
- **自主学习** — 会记住你的偏好，从经验中创建技能，搜索过去的对话
- **任务自动化** — 内置定时任务调度，日报/备份/监控都能自动跑
- **并行独立子代理** — 可以同时派多个子代理做不同的事

## Windows 安装方式选择

Hermes Agent 官方推荐 **WSL2** 方式安装（最稳定）。Native Windows 也支持（PowerShell 一键安装，但标记为早期测试版）。

| 方式 | 稳定性 | 适用人群 |
|------|--------|---------|
| **WSL2（推荐）** | ⭐⭐⭐⭐⭐ 生产级 | 大多数用户 |
| **Native Windows** | ⭐⭐⭐ 早期测试版 | 不想装 WSL 的用户 |

**如果你已经装了 WSL2**（比如 Ubuntu），直接跳到「WSL2 安装」部分。
**如果你没用过 WSL**，我推荐装一个——不只是为了 Hermes Agent，以后做开发也会用到的。

---

## 方法一：WSL2 安装（推荐）

### 第一步：安装 WSL2

用管理员身份打开 PowerShell，运行：

```powershell
wsl --install
```

这会自动启用 WSL、安装 Ubuntu 发行版。完成后重启电脑。

启动 Ubuntu：

```powershell
wsl
```

设置好你的 Linux 用户名和密码后，就进入 WSL 终端了。

> **如果遇到 `wsl: 不支持` 错误**：去 BIOS 开启虚拟化（Intel VT-x / AMD SVM），然后在 PowerShell 运行 `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart` 和 `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`，重启后再试。

### 第二步：一键安装 Hermes Agent

在 WSL 终端里，运行：

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

这个脚本会帮你装好：
- **uv**（Python 包管理器，比 pip 快 10 倍）
- **Python 3.11**
- **Node.js**
- **ripgrep**、**ffmpeg** 等依赖
- Hermes Agent 本体及所有依赖

安装完成后，刷新 shell：

```bash
source ~/.bashrc
```

### 第四步：验证安装

```bash
hermes doctor
```

运行 `hermes doctor` 会检查所有依赖是否齐全，没问题的话会显示绿色通过。

---

## 方法二：Native Windows 安装（PowerShell）

如果你不想用 WSL，Hermes 也提供了原生 Windows 安装方式（早期测试）。

用管理员身份打开 PowerShell，运行：

```powershell
irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex
```

安装程序会自动处理：
- Python 3.11
- Node.js
- ripgrep、ffmpeg 等工具
- **便携版 Git Bash**（MinGit，解压到 `%LOCALAPPDATA%\hermes\git`，不影响你已有的 Git）

安装位置：`%LOCALAPPDATA%\hermes`（WSL2 则在 `~/.hermes`）

> ⚠️ **注意**：原生 Windows 的仪表板网页聊天功能需要 PTY 支持，目前只能在 WSL 下使用。CLI 和网关在原生 Windows 上正常工作。

---

## 配置 DeepSeek 模型

Hermes Agent 默认使用 Nous Research 的官方 API，但你可以改成用 DeepSeek——它性价比很高，尤其是 V4 Flash 系列。

### 第一步：获取 DeepSeek API Key

1. 打开 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 点击「创建 API Key」，复制生成的 key

> **注意**：DeepSeek API Key 有过期机制，如果遇到 `401 authentication_error`，需要重新生成一个。

### 第二步：配置 Hermes

编辑配置文件 `~/.hermes/config.yaml`：

```yaml
providers:
  deepseek:
    name: deepseek
    base_url: https://api.deepseek.com/v1
    env_vars: DEEPSEEK_API_KEY
    models:
      deepseek-chat: {}
      deepseek-reasoner: {}
      deepseek-v4-pro: {}
      deepseek-v4-flash: {}
```

在 `model` 部分设置默认模型：

```yaml
model:
  default: deepseek-v4-flash
  provider: deepseek
```

### 第三步：配置 API Key

编辑 `~/.hermes/.env`，添加一行：

```bash
DEEPSEEK_API_KEY=sk-你的密钥粘贴在这里
```

> 注意 `.env` 是存放密钥的文件，**不要**提交到 Git。它应该已经在 `.gitignore` 里了。

### 第四步：重启生效

修改完配置文件后，重新启动 Hermes Agent：

```bash
hermes
```

或者如果已经在聊天，输入 `/reset` 重新加载配置。

### 第五步：切换模型测试

在聊天中输入以下命令切换模型：

```
/model deepseek-v4-flash
```

然后随便发条消息测试：

```
你好，帮我测试一下连接。
```

如果正常回复，说明配置成功！

---

## DeepSeek 模型选择

目前 DeepSeek 提供以下模型：

| 模型 ID | 类型 | 适合场景 |
|---------|------|---------|
| `deepseek-v4-flash` | V4 Flash | 日常对话、简单任务、快速响应 |
| `deepseek-v4-pro` | V4 Pro | 复杂推理、编码、高端任务 |
| `deepseek-chat` | V3 聊天 | 通用对话 |
| `deepseek-reasoner` | 推理模型 | 深度推理、数学 |

**我的推荐策略：** 日常用 `deepseek-v4-flash`，省钱又够用；需要做复杂代码/逻辑推理时切 `deepseek-v4-pro`。切换命令就是 `/model deepseek-v4-pro`。

### V4 定价参考（官方定价，截至 2026/05）

| 项目 | deepseek-v4-flash | deepseek-v4-pro |
|------|------------------|----------------|
| 输入（缓存命中） | $0.0028 / 1M tokens | $0.0036 / 1M tokens |
| 输入（缓存未命中） | $0.14 / 1M tokens | $0.44 / 1M tokens |
| 输出 | $0.28 / 1M tokens | $0.87 / 1M tokens |

V4 Pro 目前有 75% 折扣，Flash 价格是 Pro 的约 1/3。

---

## 常用命令

配置好之后，你还需要知道几个常用命令：

```bash
hermes              # 启动交互式 CLI
hermes model        # 切换 LLM 提供商/模型
hermes tools        # 配置启用哪些工具集
hermes config set   # 修改单个配置项
hermes setup        # 运行设置向导
hermes doctor       # 诊断问题
hermes update       # 更新到最新版本
hermes gateway      # 启动网关（连接 Telegram 等平台）
```

**CLI 内命令（输入 `/` 开头）：**

```
/help           # 显示帮助
/model <id>     # 切换模型
/new            # 新建对话
/clear          # 清除当前对话
/search <关键词> # 搜索历史对话
/memory         # 查看记忆
/skills         # 查看技能
```

---

## 常见问题

### Q: Windows Defender 阻止了安装脚本？

PowerShell 可能会提示「未签名的脚本」。以管理员身份运行，然后先执行：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

再运行安装命令。

### Q: 连接 DeepSeek 时报错 401？

API Key 可能已过期，登录 DeepSeek 平台重新生成一个，更新 `.env` 文件。

### Q: 怎么改成中文界面？

Hermes 默认是英文，但你可以要求它用中文回复。在聊天开始时说「请用中文回复」即可。也可以配置系统提示词：

```yaml
# config.yaml
system_prompt: "你是 Hermes Agent，请使用中文与用户交流。"
```

### Q: WSL 和原生 Windows 哪个好？

WSL2 路线更成熟、经过大量测试。原生 Windows 安装方便但有些高级功能（网页仪表板聊天）需要 WSL。如果你只是用 CLI 聊天，两个都可以。

### Q: 网络连接问题（中国大陆用户）

DeepSeek 的 API 服务器在国内可直接访问（`api.deepseek.com`），不需要代理。这是 DeepSeek 相比 OpenAI 的一大优势。

如果你同时使用 OpenAI 等境外 API，需要在 WSL 中配置代理：
1. Windows Clash 开启 `allow-lan: true`
2. WSL 中设置：
```bash
export HTTP_PROXY=http://<windows-ip>:7897
export HTTPS_PROXY=http://<windows-ip>:7897
```
3. 可以写进 `~/.bashrc` 持久化。

---

## 进阶：看看 Hermes 还能做什么

装好只是开始。Hermes Agent 的真正能力在深入使用后才会体现出来：

- **定时任务**：设置一个每天早上 8 点推送 AI 新闻的 cron job
- **跨平台聊天**：同一个代理可以同时在 Telegram、Discord、微信上回复
- **子代理并行**：让 3 个子代理同时研究不同方向，汇总结果
- **记忆系统**：你纠正了它一次，它就记住了，以后不会犯同样的错
- **技能自动化**：完成一个复杂任务后，它会把流程保存为「技能」，下次直接复用

---

## 相关资料

- [Hermes Agent 官方文档](https://hermes-agent.nousresearch.com/docs/)
- [Hermes Agent GitHub](https://github.com/NousResearch/hermes-agent)
- [DeepSeek 开放平台](https://platform.deepseek.com/)
- [Nous Research](https://nousresearch.com)

如果安装过程中遇到问题，欢迎在评论区交流。
