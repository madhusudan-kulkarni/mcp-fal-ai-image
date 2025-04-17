# MCP fal.ai Image Server

[![npm version](https://img.shields.io/npm/v/mcp-fal-ai-image.svg)](https://www.npmjs.com/package/mcp-fal-ai-image)
[![Node.js Version](https://img.shields.io/node/v/mcp-fal-ai-image)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/madhusudan-kulkarni/mcp-fal-ai-image)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Generate images from text prompts using [fal.ai](https://fal.ai) via the Model Context Protocol (MCP). This project is intended for use as a backend tool in AI IDEs such as Cursor, Windsurf, or any other MCP-compatible editor.

---

## Features

- Text-to-image generation with fal.ai
- Support for multiple models and image sizes
- Simple integration with IDEs via MCP server configuration
- TypeScript source code, open source, MIT-licensed

---

## 🚀 Quick Setup (Cursor & Windsurf)

1. **Install Requirements**

   - Node.js **18+**: [Download Node.js](https://nodejs.org/)
   - Get your [fal.ai API key](https://fal.ai)

2. **Add MCP Server to Your IDE**

   - In Cursor, Windsurf, or any MCP-compatible IDE, add the following to your MCP server configuration:
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
   - Replace `YOUR-FAL-AI-API-KEY` with your actual API key.

3. **Start Generating Images**
   - Use the `generate-image` tool from your IDE's command palette or MCP UI.
   - See below for usage examples and supported options.

> **Troubleshooting:**
>
> - If you see `FAL_KEY environment variable is not set`, set your API key as shown above.
> - If `npx` is not found, install Node.js 18+ and npm.

---

---

## 📝 Usage

### Tool: `generate-image`

- **prompt** (string, required): Image description
- **model** (string, optional): Model ID (see below, default: `fal-ai/recraft-v3`)
- **image_size** (string, optional): `square_hd`, `square`, `portrait_4_3`, `portrait_16_9`, `landscape_4_3`, `landscape_16_9` (default: `landscape_4_3`)
- **num_images** (int, optional): Number of images to generate (default: 1)
- **num_inference_steps** (int, optional): Number of inference steps (default: 28)
- **guidance_scale** (float, optional): Classifier Free Guidance scale (default: 3.5)
- **enable_safety_checker** (bool, optional): Enable the safety checker (default: true)

---

<details>
<summary>🧩 Supported Models</summary>

- fal-ai/recraft-v3
- fal-ai/stable-diffusion-v35-large
- fal-ai/flux-lora
- fal-ai/flux-general
- fal-ai/kolors
- fal-ai/stable-cascade
- fal-ai/aura-flow
- fal-ai/flux-pro/v1.1

</details>

---

## 🛠 Troubleshooting

- **`Warning: FAL_KEY environment variable is not set. API calls will fail.`**: Set your fal.ai API key in the environment as `FAL_KEY`.
- **`failed to initialize: request failed`**: Ensure your API key is correct and your network allows outbound HTTPS.
- **`npx: command not found`**: Install Node.js 18+ and npm.
- **Still stuck?** [Open an issue](https://github.com/madhusudan-kulkarni/mcp-fal-ai-image/issues).

---

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
