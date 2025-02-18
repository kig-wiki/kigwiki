import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

const resolveDid = async (handle: string): Promise<string> => {
  const response = await fetch(
    `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
  );
  const data = await response.json();
  return data.did;
};

const remarkSocialEmbeds: Plugin = () => {
  return async (tree) => {
    const promises: Promise<void>[] = [];

    visit(tree, 'mdxJsxFlowElement', (node) => {
      if (node.name === 'SocialEmbed' && node.attributes) {
        const platform = node.attributes.find((attr) => attr.name === 'platform')?.value;
        const id = node.attributes.find((attr) => attr.name === 'id')?.value;

        if (platform === 'bluesky' && typeof id === 'string') {
          const [handle] = id.split('/post/');
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
      }
    });

    await Promise.all(promises);
  };
};

export default remarkSocialEmbeds; 