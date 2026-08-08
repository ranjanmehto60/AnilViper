import "server-only";

if (typeof process !== "undefined" && process.env) {
  const newUrl =
    process.env.POSTGRES_NEW_DATABASE_URL ||
    process.env.POSTGRES_NEW_URL ||
    process.env.POSTGRES_NEW_POSTGRES_URL;

  if (newUrl) {
    process.env.POSTGRES_URL = newUrl;
    process.env.POSTGRES_PRISMA_URL = newUrl;
    process.env.POSTGRES_URL_NON_POOLING = newUrl;
    process.env.DATABASE_URL = newUrl;
  }
}
