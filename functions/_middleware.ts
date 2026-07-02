const MARKDOWN_CONTENT_TYPE = "text/markdown; charset=utf-8";

const MARKDOWN_EXCLUDED_PREFIXES = ["/assets/", "/icons/", "/img/", "/search/"];
const MARKDOWN_EXCLUDED_EXTENSIONS =
  /\.(?:md|js|css|map|png|jpe?g|gif|webp|svg|ico|woff2?|xml|json|webmanifest|txt)$/i;

function requestAcceptsMarkdown(acceptHeader: string): boolean {
  if (!acceptHeader) {
    return false;
  }

  return acceptHeader.split(",").some((mediaRange) => {
    const [rawType, ...params] = mediaRange.trim().toLowerCase().split(";");
    if (rawType !== "text/markdown") {
      return false;
    }
    const qParam = params.find((param) => param.trim().startsWith("q="));
    if (!qParam) {
      return true;
    }
    const parsedQuality = Number(qParam.split("=")[1]);
    return Number.isFinite(parsedQuality) ? parsedQuality > 0 : true;
  });
}

function markdownAssetCandidates(pathname: string): string[] {
  if (pathname === "/") {
    return ["/index.md"];
  }
  const normalizedPath = `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  return [`${normalizedPath}/index.md`, `${normalizedPath}.md`];
}

function shouldSkipMarkdownNegotiation(pathname: string): boolean {
  if (MARKDOWN_EXCLUDED_EXTENSIONS.test(pathname)) {
    return true;
  }
  return MARKDOWN_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function appendVaryAccept(headers: Headers): void {
  const vary = headers.get("Vary");
  if (!vary) {
    headers.set("Vary", "Accept");
    return;
  }
  const parts = vary
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (!parts.includes("accept")) {
    headers.set("Vary", `${vary}, Accept`);
  }
}

async function fetchMarkdownAsset(
  context: any,
  requestUrl: URL,
  candidatePath: string,
): Promise<Response | null> {
  try {
    const assetUrl = new URL(candidatePath, requestUrl).toString();
    if (context.env?.ASSETS) {
      return await context.env.ASSETS.fetch(assetUrl, { method: "GET" });
    }
    return await context.next(candidatePath, { method: "GET" });
  } catch {
    return null;
  }
}

export const onRequest = async (context: any): Promise<Response> => {
  const acceptHeader = context.request.headers.get("Accept") ?? "";
  if (!requestAcceptsMarkdown(acceptHeader)) {
    return context.next();
  }

  const requestUrl = new URL(context.request.url);
  if (shouldSkipMarkdownNegotiation(requestUrl.pathname)) {
    return context.next();
  }

  for (const candidatePath of markdownAssetCandidates(requestUrl.pathname)) {
    const markdownResponse = await fetchMarkdownAsset(context, requestUrl, candidatePath);
    if (!markdownResponse?.ok) {
      continue;
    }

    const markdownBody = await markdownResponse.text();
    const headers = new Headers(markdownResponse.headers);
    headers.set("Content-Type", MARKDOWN_CONTENT_TYPE);
    headers.set("x-markdown-tokens", String(Math.ceil(markdownBody.length / 4)));
    headers.set("X-Content-Negotiation", "markdown");
    appendVaryAccept(headers);

    return new Response(markdownBody, {
      status: markdownResponse.status,
      headers,
    });
  }

  return context.next();
};
