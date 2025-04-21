[![npm version](https://img.shields.io/npm/v/mcp-fal-ai-image.svg)](https://www.npmjs.com/package/mcp-fal-ai-image) [![Node.js Version](https://img.shields.io/node/v/mcp-fal-ai-image)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# MCP fal.ai Image Server

Effortlessly generate images from text prompts using [fal.ai](https://fal.ai) and the Model Context Protocol (MCP). Integrates directly with AI IDEs like Cursor and Windsurf.

## When and Why to Use

This tool is designed for:
- Developers and designers who want to generate images from text prompts without leaving their IDE.
- Rapid prototyping of UI concepts, marketing assets, or creative ideas.
- Content creators needing unique visuals for blogs, presentations, or social media.
- AI researchers and tinkerers experimenting with the latest fal.ai models.
- Automating workflows that require programmatic image generation via MCP.

Key features:
- Supports any valid fal.ai model and all major image parameters.
- Works out of the box with Node.js and a fal.ai API key.
- Saves images locally with accessible file paths.
- Simple configuration and robust error handling.

## Quick Start

1. **Requirements:** Node.js 18+, [fal.ai API key](https://fal.ai)
2. **Configure MCP:**
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
3. **Run:** Use the `generate-image` tool from your IDE.

> **💡 Typical Workflow:**
> Describe the image you want (e.g., “generate a landscape with flying cars using model fal-ai/kolors, 2 images, landscape_16_9”) and get instant results in your IDE.

### 🗨️ Example Prompts

- `generate an image of a red apple`
- `generate an image of a red apple using model fal-ai/kolors`
- `generate 3 images of a glowing red apple in a futuristic city using model fal-ai/recraft-v3, square_hd, 40 inference steps, guidance scale 4.0, safety checker on`

**Supported parameters:** prompt, model ID (any fal.ai model), number of images, image size, inference steps, guidance scale, safety checker.

Images are saved locally; file paths are shown in the response. For model IDs, see [fal.ai/models](https://fal.ai/models).

## Troubleshooting

- `FAL_KEY environment variable is not set`: Set your fal.ai API key as above.
- `npx` not found: Install Node.js 18+ and npm.

<details>
<summary>Advanced: Example MCP Request/Response</summary>

```json
{
  "tool": "generate-image",
  "args": {
    "prompt": "A futuristic cityscape at sunset",
    "model": "fal-ai/kolors"
  }
}

// Example response
{
  "images": [
    { "url": "file:///path/to/generated_image1.png" },
    { "url": "file:///path/to/generated_image2.png" }
  ]
}
```

</details>

## 📁 Image Output Directory

Generated images are saved to your local system:

- **By default:** `~/Downloads/fal_ai` (on Linux/macOS; uses XDG standard if available)
- **Custom location:** Set the environment variable `FAL_IMAGES_OUTPUT_DIR` to your desired folder. Images will be saved in `<your-folder>/fal_ai`.

The full file path for each image is included in the tool's response.

## ⚠️ Error Handling & Troubleshooting

- If you specify a model ID that is not supported by fal.ai, you will receive an error from the backend. Double-check for typos or visit [fal.ai/models](https://fal.ai/models) to confirm the model ID.
- For the latest list of models and their capabilities, refer to the [fal.ai model catalog](https://fal.ai/models) or [API docs](https://fal.ai/docs/api).
- For other errors, consult your MCP client logs or open an issue on GitHub.

## 🤝 Contributing

Contributions and suggestions are welcome! Please open issues or pull requests on [GitHub](https://github.com/madhusudan-kulkarni/mcp-fal-ai-image).

## 🔒 Security

- Your API key is only used locally to authenticate with fal.ai.
- No user data is stored or transmitted except as required by fal.ai API.

## 🔗 Links

- [NPM](https://www.npmjs.com/package/mcp-fal-ai-image)
- [GitHub](https://github.com/madhusudan-kulkarni/mcp-fal-ai-image)
- [fal.ai](https://fal.ai)

## 🛡 License

MIT License © 2025 Madhusudan Kulkarni
