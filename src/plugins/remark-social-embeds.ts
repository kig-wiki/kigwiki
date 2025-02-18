import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

// Simple rate limiter implementation
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastCallTime = 0;
  private interval: number;
  
  constructor(interval = 100) { // 100ms between requests = max 10 requests per second
    this.interval = interval;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }

  private async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const timeSinceLastCall = now - this.lastCallTime;
      
      if (timeSinceLastCall < this.interval) {
        await new Promise(resolve => setTimeout(resolve, this.interval - timeSinceLastCall));
      }
      
      const fn = this.queue.shift();
      if (fn) {
        this.lastCallTime = Date.now();
        await fn();
      }
    }
    
    this.processing = false;
  }
}

// Create rate limiter instance
const rateLimiter = new RateLimiter();

// Add TikTok oembed interface
interface TikTokOEmbed {
  html: string;
  version: string;
  type: string;
  title: string;
  provider_name: string;
}

// Resolves Bluesky handles to DIDs
// If we need to resolve other such social media handles, we can add them here

const resolveDid = async (handle: string): Promise<string> => {
  return rateLimiter.add(async () => {
    const response = await fetch(
      `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
    );
    const data = await response.json();
    return data.did;
  });
};

// Add TikTok oembed resolver
const resolveTikTokEmbed = async (url: string): Promise<string> => {
  return rateLimiter.add(async () => {
    const response = await fetch(
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
    );
    const data: TikTokOEmbed = await response.json();
    return data.html;
  });
};

const remarkSocialEmbeds: Plugin = () => {
  return async (tree) => {
    const promises: Promise<void>[] = [];

    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'SocialEmbed' && node.attributes) {
        const postAttr = node.attributes.find((attr) => attr.name === 'post')?.value;
        
        if (typeof postAttr === 'string') {
          if (postAttr.includes('bsky.app')) {
            const match = postAttr.match(/\/profile\/([^/]+)\/post\//);
            if (match) {
              const handle = match[1];
              promises.push(
                resolveDid(handle).then((did) => {
                  node.attributes.push({
                    type: 'mdxJsxAttribute',
                    name: 'did',
                    value: did,
                  });
                })
              );
            }
          } else if (postAttr.includes('tiktok.com')) {
            promises.push(
              resolveTikTokEmbed(postAttr).then((html) => {
                node.attributes.push({
                  type: 'mdxJsxAttribute',
                  name: 'embedHtml',
                  value: html,
                });
              })
            );
          }
        }
      }
    });

    await Promise.all(promises);
  };
};

export default remarkSocialEmbeds; 