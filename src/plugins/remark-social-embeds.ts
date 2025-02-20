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

// Add these type definitions at the top of the file
interface MdxJsxAttribute {
  type: 'mdxJsxAttribute';
  name: string;
  value: string;
}

interface MdxJsxFlowElement {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: MdxJsxAttribute[];
}

// Resolves Bluesky handles to DIDs
// If we need to resolve other such social media handles, we can add them here

const resolveDid = async (handle: string): Promise<string> => {
  console.log('Starting DID resolution for handle:', handle);
  return rateLimiter.add(async () => {
    try {
      const url = `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('API Response:', { status: response.status, data });
      
      if (!response.ok) {
        console.error('Failed to resolve DID:', data);
        throw new Error(`Failed to resolve DID: ${response.statusText}`);
      }
      
      if (!data.did) {
        console.error('No DID in response:', data);
        throw new Error('No DID in response');
      }
      
      console.log('Successfully resolved DID:', data.did);
      return data.did;
    } catch (error) {
      console.error('Error in resolveDid:', error);
      throw error;
    }
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

    visit(tree, 'mdxJsxFlowElement', (node: MdxJsxFlowElement) => {
      if (node.name === 'SocialEmbed' && node.attributes) {
        const postAttr = node.attributes.find((attr: MdxJsxAttribute) => attr.name === 'post')?.value;
        console.log('Processing SocialEmbed with post:', postAttr);
        
        if (typeof postAttr === 'string') {
          if (postAttr.includes('bsky.app')) {
            const match = postAttr.match(/bsky\.app\/profile\/([\w.-]+)\/post\//);
            console.log('URL match result:', match);
            
            if (match) {
              const handle = match[1];
              console.log('Extracted handle:', handle);
              
              promises.push(
                resolveDid(handle)
                  .then((did) => {
                    console.log('Received DID:', did);
                    if (!did || typeof did !== 'string') {
                      console.warn(`Invalid DID returned for handle: ${handle}`);
                      return;
                    }
                    node.attributes.push({
                      type: 'mdxJsxAttribute',
                      name: 'did',
                      value: did,
                    });
                    console.log('Successfully added DID attribute to node');
                  })
                  .catch((error) => {
                    console.error(`Error resolving DID for handle ${handle}:`, error);
                  })
              );
            } else {
              console.warn('No handle match found in URL:', postAttr);
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

    console.log('Waiting for all promises to resolve...');
    await Promise.all(promises);
    console.log('All promises resolved');
  };
};

export default remarkSocialEmbeds; 