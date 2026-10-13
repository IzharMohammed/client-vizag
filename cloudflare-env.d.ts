declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ADMIN_PASSWORD_HASH?: string;
    ADMIN_SESSION_SECRET?: string;
    GOOGLE_PLACES_API_KEY?: string;
    GOOGLE_PLACE_ID?: string;
  }
}
