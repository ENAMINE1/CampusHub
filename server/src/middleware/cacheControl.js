// HTTP caching rules (SPEC.md): public lists may be cached for 60 seconds by browsers and CDNs;
// anything personal must never be cached.
// A request that carries a login token is personal, even on a public URL (a club admin must see
// the event they just created), so it gets no-store too. "Vary: Authorization" tells caches that
// the answer depends on that header.
export function publicFor(seconds) {
  return (req, res, next) => {
    res.set('Vary', 'Authorization');
    res.set(
      'Cache-Control',
      req.headers.authorization ? 'no-store' : `public, max-age=${seconds}`,
    );
    next();
  };
}

export function noStore(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
}
