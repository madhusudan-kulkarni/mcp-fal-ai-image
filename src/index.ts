#!/usr/bin/env node

/**
 * This server is intended exclusively for use as a Model Context Protocol (MCP) server.
 * Do not use as an HTTP or CLI server.
 * For protocol details, see: https://modelcontextprotocol.io
 */

import { fal } from '@fal-ai/client';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config();

// Define image size type
type ImageSize =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';

// Save images in <output_dir>/fal_ai
// - If FAL_IMAGES_OUTPUT_DIR env var is set, use that as base directory
// - Otherwise, default to process.cwd() (directory where process is started)
// This ensures distributed teams and orchestrators can control output location.
// Save images in the user's default Downloads folder (XDG standard or ~/Downloads)
function getDefaultDownloadsDir() {
  // Try XDG_DOWNLOAD_DIR from user-dirs.dirs, else fallback to ~/Downloads
  const home = process.env.HOME || process.env.USERPROFILE;
  let downloadsDir = home ? path.join(home, 'Downloads') : './Downloads';
  try {
    const userDirs = path.join(home, '.config', 'user-dirs.dirs');
    if (fs.existsSync(userDirs)) {
      const content = fs.readFileSync(userDirs, 'utf8');
      const match = content.match(/XDG_DOWNLOAD_DIR="(.*)"/);
      if (match && match[1]) {
        downloadsDir = match[1].replace('$HOME', home);
      }
    }
  } catch {}
  return downloadsDir;
}
const FAL_IMAGES_DIR = process.env.FAL_IMAGES_OUTPUT_DIR
  ? path.join(process.env.FAL_IMAGES_OUTPUT_DIR, 'fal_ai')
  : path.join(getDefaultDownloadsDir(), 'fal_ai');

// Ensure the download directory exists
function ensureDownloadDir() {
  if (!fs.existsSync(FAL_IMAGES_DIR)) {
    fs.mkdirSync(FAL_IMAGES_DIR, { recursive: true });
    console.error(`Created directory: ${FAL_IMAGES_DIR}`);
  }
}

// Function to download an image
async function downloadImage(url: string, prompt: string, idx?: number): Promise<string> {
  ensureDownloadDir();

  // Generate a filename from the prompt and timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedPrompt = prompt
    .slice(0, 30)
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  const filename = `${sanitizedPrompt}_${timestamp}${typeof idx === 'number' ? `_${idx + 1}` : ''}.png`;
  const filepath = path.join(FAL_IMAGES_DIR, filename);

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.error(`✅ Downloaded image to: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`❌ Failed to download image: ${error}`);
    throw error;
  }
}

// Set FAL API key
if (process.env.FAL_KEY) {
  fal.config({
    credentials: process.env.FAL_KEY,
  });
} else {
  console.error(
    'Warning: FAL_KEY environment variable is not set. API calls will fail.'
  );
}

// Top 10 supported text-to-image models
export const SUPPORTED_MODELS = [
  {
    id: 'fal-ai/recraft-v3',
    name: 'Recraft V3',
    description: 'SOTA vector and brand-style image generator',
  },
  {
    id: 'fal-ai/stable-diffusion-v35-large',
    name: 'Stable Diffusion 3.5 Large',
    description: 'High-quality, resource-efficient diffusion model',
  },
  {
    id: 'fal-ai/flux-lora',
    name: 'FLUX.1 [dev] with LoRAs',
    description: 'Super fast FLUX.1 [dev] model with LoRA support',
  },
  {
    id: 'fal-ai/flux-general',
    name: 'FLUX General',
    description: 'General-purpose text-to-image model',
  },
  {
    id: 'fal-ai/kolors',
    name: 'Kolors',
    description: 'Model with vivid color and artistic style',
  },
  {
    id: 'fal-ai/stable-cascade',
    name: 'Stable Cascade',
    description: 'Cascade-style diffusion model',
  },
  {
    id: 'fal-ai/aura-flow',
    name: 'Aura Flow',
    description: 'Artistic flow-based image generator',
  },
  {
    id: 'fal-ai/flux-pro/v1.1',
    name: 'FLUX Pro v1.1',
    description: 'Professional-grade FLUX model',
  },
];

// Example: Text to Image with model selection
export async function generateImageFromText(
  prompt: string,
  imageSize: ImageSize = 'landscape_4_3',
  numInferenceSteps = 28,
  guidanceScale = 3.5,
  numImages = 1,
  enableSafetyChecker = true,
  model: string = SUPPORTED_MODELS[0].id // default to first model
) {
  // Validate model
  const foundModel = SUPPORTED_MODELS.find((m) => m.id === model);
  if (!foundModel) {
    throw new Error(
      `Unsupported model. Supported models: ` +
        SUPPORTED_MODELS.map((m) => `${m.name} (${m.id})`).join(', ')
    );
  }
  try {
    const result = await fal.subscribe(model, {
      input: {
        prompt,
        image_size: imageSize,
        num_inference_steps: numInferenceSteps,
        guidance_scale: guidanceScale,
        num_images: numImages,
        enable_safety_checker: enableSafetyChecker,
      },
      logs: true,
      onQueueUpdate: (update: any) => {
        if (update.status === 'IN_PROGRESS' && update.logs) {
          update.logs.map((log: any) => log.message).forEach(console.error);
        }
      },
    });
    console.error('Image generation result:', result.data);

    // Download images and enhance the result with local paths
    if (result.data && result.data.images) {
      const downloadedImages = await Promise.all(
        result.data.images.map(async (img: any, idx: number) => {
          try {
            const localPath = await downloadImage(img.url, prompt, idx);
            console.error(`Image #${idx + 1} saved to: ${localPath}`);
            return { ...img, localPath };
          } catch (error) {
            console.error(`Failed to download image #${idx + 1}:`, error);
            return img;
          }
        })
      );

      // Replace the images with the enhanced versions that include local paths
      result.data.images = downloadedImages;
    }

    return result.data;
  } catch (err: any) {
    console.error('FAL text-to-image error:', err?.response?.data || err);
    throw err;
  }
}

// Example usage (uncomment to test):
// generateImageFromText("A cute cat, sitting and looking at the camera, highly detailed, photorealistic.");

// Create image generator MCP server
const server = new Server(
  { name: 'image-generator', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Import MCP schemas
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'generate-image',
        description:
          'Generate an image from a text prompt using a selectable text-to-image model.',
        inputSchema: {
          type: 'object',
          properties: {
            prompt: {
              type: 'string',
              description: 'Text prompt describing the image to generate',
            },
            model: {
              type: 'string',
              enum: SUPPORTED_MODELS.map((m) => m.id),
              default: SUPPORTED_MODELS[0].id,
              description: 'ID of the text-to-image model to use',
            },
            image_size: {
              type: 'string',
              enum: [
                'square_hd',
                'square',
                'portrait_4_3',
                'portrait_16_9',
                'landscape_4_3',
                'landscape_16_9',
              ],
              default: 'landscape_4_3',
              description: 'Size of the generated image',
            },
            num_images: {
              type: 'integer',
              default: 1,
              description: 'Number of images to generate',
            },
            num_inference_steps: {
              type: 'integer',
              default: 28,
              description: 'Number of inference steps',
            },
            guidance_scale: {
              type: 'number',
              default: 3.5,
              description: 'Classifier Free Guidance scale',
            },
            enable_safety_checker: {
              type: 'boolean',
              default: true,
              description: 'Enable the safety checker',
            },
          },
          required: ['prompt'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  const { name, arguments: args } = request.params;
  if (name === 'generate-image') {
    try {
      const result = await generateImageFromText(
        args.prompt,
        args.image_size,
        args.num_inference_steps,
        args.guidance_scale,
        args.num_images,
        args.enable_safety_checker,
        args.model // new model param
      );
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Error generating image: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  } else {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${name}`,
        },
      ],
    };
  }
});

// Endpoint to list supported models (for CLI, docs, or future HTTP server)
export function listSupportedModels() {
  return SUPPORTED_MODELS;
}

// Start the server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Text-to-Image MCP Server running on stdio');
    console.error(
      'Supported models:',
      SUPPORTED_MODELS.map((m) => `${m.name} (${m.id})`).join(', ')
    );
  } catch (error: any) {
    console.error('Error starting server:', error);
  }
}

main();
