// Shared toJSON settings for every model: whenever a document becomes JSON (res.json(doc),
// JSON.stringify), expose `id` instead of `_id`, drop `__v`, and never include secrets.
// A safety net: even if some future code sends a whole user document, no hash leaks out.
const toJSONOptions = {
  versionKey: false,
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.refreshTokenHash;
    return ret;
  },
};

export default toJSONOptions;
