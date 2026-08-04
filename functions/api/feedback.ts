type Env = {
  TURNSTILE_SECRET_KEY?: string;
  DISCORD_WEBHOOK_URL?: string;
};

type FeedbackBody = {
  name?: unknown;
  message?: unknown;
  turnstileToken?: unknown;
};

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_BODY_BYTES = 8_192;

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

/** Compact denylist for severe slurs (incl. common leetspeak). Silent-drop on match. */
const BLOCKED_PATTERN =
  /\b(?:n+[i1!l][gq]{1,2}[e3a@]r?s?|n[i1!][gq]+[a@]|f+[a@4][gq]+(?:[o0]t)?s?|r+[e3][t7][a@4]rds?|tr+ann+(?:y|ie)s?|k[i1!]ke?s?|sp[i1!]cs?|ch[i1!]nks?|g[o0]{2,}ks?)\b/i;

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {status, headers: JSON_HEADERS});
}

/** Always looks like success to the client (silent drop / honeypot responses). */
function fakeSuccess(): Response {
  return jsonResponse({ok: true});
}

function normalizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.replace(/\0/g, '').trim().slice(0, maxLength);
}

function containsBlockedLanguage(...parts: string[]): boolean {
  const haystack = parts.join(' ').toLowerCase();
  return BLOCKED_PATTERN.test(haystack);
}

async function verifyTurnstile(secret: string, token: string): Promise<boolean> {
  const form = new URLSearchParams();
  form.set('secret', secret);
  form.set('response', token);

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: form,
      },
    );
    if (!response.ok) {
      return false;
    }
    const result = (await response.json()) as {success?: boolean};
    return result.success === true;
  } catch {
    return false;
  }
}

async function postDiscordWebhook(
  webhookUrl: string,
  displayName: string,
  message: string,
): Promise<boolean> {
  const payload = {
    embeds: [
      {
        title: 'Kig.wiki feedback',
        color: 0x6b7fd7,
        description: message.slice(0, 4000),
        fields: [{name: 'From', value: displayName.slice(0, 256) || 'Anonymous'}],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const {request, env} = context;
  const contentLength = Number(request.headers.get('Content-Length') || '0');
  if (contentLength > MAX_BODY_BYTES) {
    return fakeSuccess();
  }

  const secret = env.TURNSTILE_SECRET_KEY;
  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  if (!secret || !webhookUrl) {
    // Misconfigured deploy: still acknowledge so the UI does not leak infra state.
    return fakeSuccess();
  }

  let body: FeedbackBody;
  try {
    body = (await request.json()) as FeedbackBody;
  } catch {
    return fakeSuccess();
  }

  const name = normalizeText(body.name, MAX_NAME_LENGTH);
  const message = normalizeText(body.message, MAX_MESSAGE_LENGTH);
  const turnstileToken = normalizeText(body.turnstileToken, 2048);
  const displayName = name || 'Anonymous';

  if (!message || !turnstileToken) {
    return fakeSuccess();
  }

  if (containsBlockedLanguage(displayName, message)) {
    return fakeSuccess();
  }

  const captchaOk = await verifyTurnstile(secret, turnstileToken);
  if (!captchaOk) {
    return fakeSuccess();
  }

  const delivered = await postDiscordWebhook(webhookUrl, displayName, message);
  if (!delivered) {
    return jsonResponse({ok: false, error: 'delivery_failed'}, 502);
  }

  return jsonResponse({ok: true});
};

export const onRequest = async (context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}): Promise<Response> => {
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: 'POST, OPTIONS',
        ...JSON_HEADERS,
      },
    });
  }
  return new Response(JSON.stringify({error: 'Method not allowed'}), {
    status: 405,
    headers: {
      ...JSON_HEADERS,
      Allow: 'POST, OPTIONS',
    },
  });
};
