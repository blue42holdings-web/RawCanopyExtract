// RCX sign-up relay (Cloudflare Worker).
// The main website posts { email, tags, hp, ms } here. This worker adds the
// person to the Shopify customer list with email marketing consent and the tags
// that say which box they signed up from. Shopify Flow emails Scott on each new customer.
//
// Settings (Cloudflare > this Worker > Settings > Variables and secrets):
//   SHOPIFY_SHOP           plain text   rawcanopyextract   (the part before .myshopify.com)
//   SHOPIFY_CLIENT_ID      plain text   from the Shopify Dev Dashboard app
//   SHOPIFY_CLIENT_SECRET  SECRET       from the Shopify Dev Dashboard app (Scott pastes this)

const API_VERSION = '2025-10';
const ALLOWED_ORIGINS = [
  'https://blue42holdings-web.github.io',
  'https://rawcanopyextract.com',
  'https://www.rawcanopyextract.com',
  'https://blue42holdings.com',
  'https://www.blue42holdings.com',
];
const ALLOWED_TAG = /^[a-z0-9' ,]{1,60}$/i;

let cached = { token: null, expires: 0 };

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function reply(origin, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });
}

async function getToken(env) {
  if (cached.token && Date.now() < cached.expires) return cached.token;
  const res = await fetch(`https://${env.SHOPIFY_SHOP}.myshopify.com/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.SHOPIFY_CLIENT_ID,
      client_secret: env.SHOPIFY_CLIENT_SECRET,
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('token: ' + JSON.stringify(data));
  cached = { token: data.access_token, expires: Date.now() + ((data.expires_in || 3600) - 300) * 1000 };
  return cached.token;
}

async function gql(env, query, variables) {
  const token = await getToken(env);
  const res = await fetch(`https://${env.SHOPIFY_SHOP}.myshopify.com/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json();
  if (data.errors) throw new Error('gql: ' + JSON.stringify(data.errors));
  return data.data;
}

const FIND = `query ($q: String!) { customers(first: 1, query: $q) { nodes { id } } }`;
const CREATE = `mutation ($input: CustomerInput!) {
  customerCreate(input: $input) { customer { id } userErrors { field message } } }`;
const ADD_TAGS = `mutation ($id: ID!, $tags: [String!]!) {
  tagsAdd(id: $id, tags: $tags) { userErrors { field message } } }`;
const CONSENT = `mutation ($input: CustomerEmailMarketingConsentUpdateInput!) {
  customerEmailMarketingConsentUpdate(input: $input) { userErrors { field message } } }`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return reply(origin, 405, { ok: false });
    if (!ALLOWED_ORIGINS.includes(origin)) return reply(origin, 403, { ok: false });

    let body;
    try { body = await request.json(); } catch { return reply(origin, 400, { ok: false }); }

    // Spam traps: a hidden field real people never see, and forms sent faster than a person can type.
    if (body.hp || (typeof body.ms === 'number' && body.ms < 2500)) return reply(origin, 200, { ok: true });

    const email = String(body.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return reply(origin, 400, { ok: false });
    const tags = ['newsletter', 'main site']
      .concat((Array.isArray(body.tags) ? body.tags : []).map(String).filter(t => ALLOWED_TAG.test(t))
        .flatMap(t => t.split(',').map(x => x.trim()).filter(Boolean)))
      .slice(0, 6);
    const consent = { marketingState: 'SUBSCRIBED', marketingOptInLevel: 'SINGLE_OPT_IN' };

    try {
      const found = await gql(env, FIND, { q: `email:"${email}"` });
      const existing = found.customers.nodes[0];
      if (existing) {
        await gql(env, ADD_TAGS, { id: existing.id, tags });
        await gql(env, CONSENT, { input: { customerId: existing.id, emailMarketingConsent: consent } });
      } else {
        const made = await gql(env, CREATE, { input: { email, tags, emailMarketingConsent: consent } });
        const errs = made.customerCreate.userErrors;
        if (errs.length) throw new Error('create: ' + JSON.stringify(errs));
      }
      return reply(origin, 200, { ok: true });
    } catch (e) {
      console.log(String(e));
      return reply(origin, 502, { ok: false });
    }
  },
};
