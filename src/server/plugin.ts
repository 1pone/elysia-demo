import { Elysia } from "elysia";

export const plugin = (app: Elysia) =>
  app
    // export const plugin = new Elysia()
    .state("version", "1.0.1" as string | undefined)
    .state("type", "fine")
    .get("/from-plugin", ({ store: { version } }) => version);
