const LEGACY_HOST = 'pets.caro.sh';
const CANONICAL_ORIGIN = 'https://codexpet.dev';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === LEGACY_HOST) {
      return Response.redirect(
        `${CANONICAL_ORIGIN}${url.pathname}${url.search}`,
        301,
      );
    }

    return env.ASSETS.fetch(request);
  },
};
