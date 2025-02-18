import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';

type Platform = 'twitter' | 'bluesky';

interface SocialEmbedProps {
  id: string;
  maxWidth?: number;
  platform: Platform;
  did?: string; // Optional DID for Bluesky, will be injected at build time
}

// Client-side only component
const EmbedContent: React.FC<SocialEmbedProps> = ({ id, maxWidth, platform, did }) => {
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    // Load platform-specific script
    const scriptSrc = platform === 'twitter' 
      ? 'https://platform.twitter.com/widgets.js'
      : 'https://embed.bsky.app/static/embed.js';

    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  }, [platform]);

  if (platform === 'twitter') {
    return (
      <div style={{ maxWidth }}>
        <blockquote
          className="twitter-tweet"
          data-dnt="true"
          data-theme={colorMode}
          data-lang="en"
        >
          <a href={`https://twitter.com/i/status/${id}`}>Loading tweet...</a>
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

  throw new Error(`Unsupported platform: ${platform}`);
};

// Main component wrapper
const SocialEmbed: React.FC<SocialEmbedProps> = (props) => {
  return (
    <BrowserOnly>
      {() => <EmbedContent {...props} />}
    </BrowserOnly>
  );
};

export default SocialEmbed; 