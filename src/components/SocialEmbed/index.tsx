import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
// Kig.wiki custom component used to embed social media posts into the page
// Currently Twitter and Bluesky are supported
// Bluesky posts are resolved to DIDs at build time in the remark plugin /src/plugins/remark-social-embeds.ts
type Platform = 'twitter' | 'bluesky' | 'tiktok' | 'youtube';

interface SocialEmbedProps {
  post: string;
  maxWidth?: number;
  did?: string; // Optional DID for Bluesky, will be injected at build time
  embedHtml?: string; // Add embedHtml prop for TikTok
}

const parsePostUrl = (url: string): { platform: Platform; id: string } => {
  try {
    const urlObj = new URL(url);
    
    // Handle YouTube URLs
    if (urlObj.hostname === 'youtube.com' || urlObj.hostname === 'www.youtube.com') {
      const videoId = urlObj.searchParams.get('v');
      if (!videoId) throw new Error('Invalid YouTube URL format');
      return { platform: 'youtube', id: videoId };
    }
    
    // Handle youtu.be URLs
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1); // Remove leading slash
      if (!videoId) throw new Error('Invalid YouTube short URL format');
      return { platform: 'youtube', id: videoId };
    }

    // Clean URL for other platforms
    const cleanUrl = url.trim()
      .replace(/^(https?:)?\/\//, 'https://')
      .replace(/\?.*$/, ''); // Remove query parameters only for non-YouTube URLs

    const cleanUrlObj = new URL(cleanUrl);

    // Handle Twitter/X URLs
    if (cleanUrlObj.hostname === 'twitter.com' || cleanUrlObj.hostname === 'x.com') {
      const matches = cleanUrlObj.pathname.match(/\/\w+\/status\/(\d+)/);
      if (!matches) throw new Error('Invalid Twitter URL format');
      return { platform: 'twitter', id: matches[1] };
    }
    
    // Handle Bluesky URLs
    if (cleanUrlObj.hostname === 'bsky.app') {
      const matches = cleanUrlObj.pathname.match(/\/profile\/([^/]+)\/post\/([^/]+)/);
      if (!matches) throw new Error('Invalid Bluesky URL format');
      return { platform: 'bluesky', id: `${matches[1]}/post/${matches[2]}` };
    }
    
    // Add TikTok URL parsing
    if (cleanUrlObj.hostname === 'www.tiktok.com' || cleanUrlObj.hostname === 'tiktok.com') {
      const matches = cleanUrlObj.pathname.match(/\/@([^/]+)\/video\/(\d+)/);
      if (!matches) throw new Error('Invalid TikTok URL format');
      return { platform: 'tiktok', id: `${matches[1]}/video/${matches[2]}` };
    }
    
    throw new Error('Unsupported platform URL');
  } catch (error) {
    console.error('Error parsing social media URL:', error);
    throw error;
  }
};

const TikTokEmbed: React.FC<{ embedHtml: string; maxWidth?: number }> = ({ embedHtml, maxWidth }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Load TikTok embed script
    const scriptId = 'tiktok-embed-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      if (window.tiktok && window.tiktok.reload) {
        // @ts-ignore
        window.tiktok.reload();
      }
    }
  }, [embedHtml]);

  // Sanitize the embedHtml and modify iframe attributes
  // sandbox settings is to yeet some spicy tiktok ones it wants to have but doesnt need. 
  const sanitizedHtml = embedHtml
    .replace(/<script.*?<\/script>/g, '')
    .replace(
      /sandbox="([^"]*)"/, 
      'sandbox="allow-scripts allow-same-origin allow-popups"'
    )
    .replace(
      /style="([^"]*)"/, 
      'style="width: 605px; height: 739px; display: block; visibility: unset; max-height: 739px;"'
    )
    .replace(
      /<blockquote([^>]*)style="[^"]*"/, 
      '<blockquote$1style="width: fit-content; margin: 10px 0; padding: 0; border: none; box-shadow: none;"'
    );

  return (
    <div 
      ref={containerRef}
      style={{ 
        maxWidth,
        width: '100%',
      }} 
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
    />
  );
};

const YouTubeEmbed: React.FC<{ id: string; maxWidth?: number }> = ({ id, maxWidth }) => {
  return (
    <div style={{ 
      maxWidth: maxWidth || 605,
      width: '100%',
      margin: '10px 0',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%' /* 16:9 Aspect Ratio */
      }}>
        <iframe
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0
          }}
          src={`https://www.youtube.com/embed/${id}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
};

// Client-side only component
const EmbedContent: React.FC<{
  platform: Platform;
  id: string;
  maxWidth?: number;
  did?: string;
  embedHtml?: string;
}> = ({ id, maxWidth, platform, did, embedHtml }) => {
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    // Load platform-specific script
    const scriptSrc = platform === 'twitter' 
      ? 'https://platform.x.com/widgets.js'
      : platform === 'bluesky'
      ? 'https://embed.bsky.app/static/embed.js'
      : platform === 'tiktok'
      ? 'https://www.tiktok.com/embed.js'
      : null; // YouTube doesn't need external script

    if (scriptSrc && !document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  }, [platform]);

  if (platform === 'youtube') {
    return <YouTubeEmbed id={id} maxWidth={maxWidth} />;
  }

  if (platform === 'twitter') {
    return (
      <div style={{ maxWidth }}>
        <blockquote
          className="twitter-tweet"
          data-dnt="true"
          data-theme={colorMode}
          data-lang="en"
        >
          <a href={`https://twitter.com/i/status/${id}`} target="_blank" rel="nofollow noopener noreferrer">Loading tweet...</a>
        </blockquote>
      </div>
    );
  }

  if (platform === 'bluesky') {
    const [handle, postId] = id.split('/post/');
    const postUri = `at://${did}/app.bsky.feed.post/${postId}`;
    
    return (
      <div style={{ maxWidth }}>
        <blockquote 
          className="bluesky-embed"
          data-bluesky-uri={postUri}
        >
          <a 
            href={`https://bsky.app/profile/${did}/post/${postId}`}
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Loading Bluesky post...
          </a>
        </blockquote>
      </div>
    );
  }

  if (platform === 'tiktok' && embedHtml) {
    return <TikTokEmbed embedHtml={embedHtml} maxWidth={maxWidth} />;
  }

  throw new Error(`Unsupported platform: ${platform}`);
};

// Main component wrapper
const SocialEmbed: React.FC<SocialEmbedProps> = ({ post, ...props }) => {
  const { platform, id } = parsePostUrl(post);
  
  return (
    <BrowserOnly>
      {() => <EmbedContent platform={platform} id={id} {...props} />}
    </BrowserOnly>
  );
};

export default SocialEmbed; 