// Cloudflare Worker: serves the lesson page files and the two lesson functions (chat + report).
import { onRequest as chat } from '../functions/api/chat.js';
import { onRequest as report } from '../functions/api/report.js';

export default {
  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname.replace(/\/+$/, '');
    if (path === '/api/chat') return chat({ request, env });
    if (path === '/api/report') return report({ request, env });
    return env.ASSETS.fetch(request);
  }
};
