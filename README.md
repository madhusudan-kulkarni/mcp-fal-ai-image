# MCP fal.ai Image Server

> **Note:** This project is exclusively for use as a Model Context Protocol (MCP) server. See [Model Context Protocol Docs](https://modelcontextprotocol.io).

[![npm version](https://img.shields.io/npm/v/mcp-fal-ai-image.svg)](https://www.npmjs.com/package/mcp-fal-ai-image)
[![Node.js Version](https://img.shields.io/node/v/mcp-fal-ai-image)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Generate images from text prompts using [fal.ai](https://fal.ai) via MCP. Designed for backend use in AI IDEs (Cursor, Windsurf, etc.) or any MCP-compatible editor.

---

## Features
- Text-to-image generation with fal.ai
- Multiple models and image sizes
- Seamless IDE integration via MCP
- TypeScript, MIT-licensed, open source

---

## Quick Start
1. **Requirements:** Node.js 18+ and a [fal.ai API key](https://fal.ai)
2. **Configure MCP Server:**
   ```json
   {
     "mcpServers": {
       "fal-ai-image": {
         "command": "npx",
         "args": ["-y", "mcp-fal-ai-image"],
         "env": { "FAL_KEY": "YOUR-FAL-AI-API-KEY" }
       }
     }
   }
   ```
   Replace `YOUR-FAL-AI-API-KEY` with your actual API key.
3. **Run:** Use the `generate-image` tool from your IDE's command palette or MCP UI.

**Troubleshooting:**
- `FAL_KEY environment variable is not set`: Set your fal.ai API key as above.
- `npx` not found: Install Node.js 18+ and npm.

---

## Usage: `generate-image` MCP Tool

**Parameters:**
- `prompt` (string, required): Image description
- `model` (string, optional): Model ID (see below; default: `fal-ai/recraft-v3`)
- `imageSize` (string, optional): One of `square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9` (default: `landscape_4_3`)
- `numImages` (int, optional): Number of images (default: 1)
- `numInferenceSteps` (int, optional): Inference steps (default: 28)
- `guidanceScale` (float, optional): Guidance scale (default: 3.5)
- `enableSafetyChecker` (bool, optional): Enable safety checker (default: true)

**Supported Models:**
- fal-ai/recraft-v3
- fal-ai/stable-diffusion-v35-large
- fal-ai/flux-lora
- fal-ai/flux-general
- fal-ai/kolors
- fal-ai/stable-cascade
- fal-ai/aura-flow
- fal-ai/flux-pro/v1.1

**Example Request:**
## 🔄 Example MCP Request/Response

**Request:**

```json
{
  "tool": "generate-image",
  "args": {
    "prompt": "A futuristic cityscape at sunset"
  }
}
```

**Response:**

```json
{
  "images": [
    {
      "url": "https://fal.ai/generated/abc123.png",
      "localPath": "/home/username/Downloads/fal_ai/a_futuristic_cityscape_at_suns_2025-04-17T10-11-11-503Z.png"
    }
  ]
}
```

---

## 📁 Image Output Directory

Generated images are saved to your local system:

- **By default:** `~/Downloads/fal_ai` (on Linux/macOS; uses XDG standard if available)
- **Custom location:** Set the environment variable `FAL_IMAGES_OUTPUT_DIR` to your desired folder. Images will be saved in `<your-folder>/fal_ai`.

The full file path for each image is included in the tool's response.

---

## 🤝 Contributing

Contributions and suggestions are welcome! Please open issues or pull requests on [GitHub](https://github.com/madhusudan-kulkarni/mcp-fal-ai-image).

---

## 🔒 Security

- Your API key is only used locally to authenticate with fal.ai.
- No user data is stored or transmitted except as required by fal.ai API.

---

## 🔗 Links

- [NPM](https://www.npmjs.com/package/mcp-fal-ai-image)
- [GitHub](https://github.com/madhusudan-kulkarni/mcp-fal-ai-image)
- [fal.ai](https://fal.ai)

---

## 🧑‍💻 Advanced Usage (Manual CLI)

If you want to run the MCP server manually (for development, debugging, or advanced use):

```sh
FAL_KEY=your_fal_api_key npx mcp-fal-ai-image
```

---

## 🛡 License

MIT License © 2025 Madhusudan Kulkarni
