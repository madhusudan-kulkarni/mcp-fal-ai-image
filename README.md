> **ARCHIVED** — This repository is no longer maintained. Issues and pull requests are closed.

[![npm version](https://img.shields.io/npm/v/mcp-fal-ai-image.svg)](https://www.npmjs.com/package/mcp-fal-ai-image) [![Node.js Version](https://img.shields.io/node/v/mcp-fal-ai-image)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

# fal.ai Image MCP Server

Generate images from text prompts using [fal.ai](https://fal.ai) and the Model Context Protocol (MCP). Integrates with AI IDEs like Cursor and Windsurf.

## Features

- Supports any valid fal.ai model and all major image parameters (size, inference steps, guidance scale, safety checker, batch of up to 5).
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

### Example Prompts

- `generate an image of a red apple`
- `generate an image of a red apple using model fal-ai/kolors`
- `generate 3 images of a glowing red apple in a futuristic city using model fal-ai/recraft-v3, square_hd, 40 inference steps, guidance scale 4.0, safety checker on`

**Supported parameters:** prompt, model ID (any fal.ai model), number of images, image size, inference steps, guidance scale, safety checker.

Images are saved locally; file paths are shown in the response. For model IDs, see [fal.ai/models](https://fal.ai/models).

## Image Output

Generated images are saved to `~/Downloads/fal_ai` by default (XDG-aware on Linux). Set `FAL_IMAGES_OUTPUT_DIR` to use a custom folder — images are saved to `<your-folder>/fal_ai`. The full file path for each image is included in the tool's response.

## Troubleshooting

- `FAL_KEY` is not set: Set your fal.ai API key as shown above.
- Model errors: Double-check the model ID at [fal.ai/models](https://fal.ai/models), or refer to the [fal.ai API docs](https://fal.ai/docs/api).
- `npx` not found: Install Node.js 18+ and npm.
- Other errors: Consult your MCP client logs.

## Security

- Your API key is used only locally to authenticate with fal.ai.
- No user data is stored or transmitted except as required by the fal.ai API.

## Links

- [NPM](https://www.npmjs.com/package/mcp-fal-ai-image)
- [GitHub](https://github.com/madhusudan-kulkarni/mcp-fal-ai-image)
- [fal.ai](https://fal.ai)

## License

MIT License © 2025 Madhusudan Kulkarni
