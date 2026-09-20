/**
 * OPTIONAL — a Cloudflare Worker that serves the wedding .ics as a download.
 *
 * Why: GitHub Pages can't set response headers, and an .ics opened by URL on an
 * iPhone is treated as a calendar to SUBSCRIBE to. Served with
 * Content-Disposition: attachment, the same file is downloaded and opens in
 * Calendar's import view (an event, not a subscription). With this deployed,
 * both the email's Apple/Outlook buttons and the site's Apple option can point
 * at https://cal.married.af/amanda-francis-wedding.ics.
 *
 * Deploy (Cloudflare dashboard, ~5 minutes; free plan is fine):
 *   1. Workers & Pages → Create → Create Worker → name it "wedding-ics" → Deploy.
 *   2. Edit code → replace everything with this file → Deploy.
 *   3. Worker → Settings → Domains & Routes → Add → Custom domain →
 *      cal.married.af. (Cloudflare adds the proxied DNS record itself; the
 *      apex married.af stays DNS-only to GitHub Pages, untouched.)
 *   4. Check: curl -I https://cal.married.af/amanda-francis-wedding.ics
 *      should show content-disposition: attachment.
 *   Then tell Claude, and the email/site links get switched to that URL.
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!url.pathname.endsWith('.ics')) {
      return Response.redirect('https://married.af/', 302);
    }
    // Always the canonical file from the site, so there is one source of truth.
    const upstream = await fetch('https://married.af/assets/amanda-francis-wedding.ics', {
      cf: { cacheTtl: 600, cacheEverything: true },
    });
    if (!upstream.ok) return new Response('Calendar file unavailable', { status: 502 });
    const body = await upstream.text();
    return new Response(body, {
      headers: {
        'content-type': 'text/calendar; charset=utf-8; method=PUBLISH',
        'content-disposition': 'attachment; filename="amanda-francis-wedding.ics"',
        'cache-control': 'public, max-age=600',
        'access-control-allow-origin': '*',
      },
    });
  },
};
