import { Elysia, NotFoundError, t } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { cron } from "@elysiajs/cron";
import { html } from "@elysiajs/html";
import User from "./user.model";
import { connectToDB } from "./mongoose";
import { plugin } from "./plugin";
import cors from "@elysiajs/cors";
import { apolloModel } from "./apollo";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = new Elysia()
  .onStart(connectToDB)
  .decorate("getDate", () => Date.now())
  .use(cors())
  .use(plugin)
  .use(staticPlugin())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Elysia Documentation",
          version: "1.0.1",
        },
      },
    }),
  )
  .use(html())
  .use(apolloModel)
  .use(
    cron({
      name: "heartbeat",
      pattern: "*/10 * * * * *",
      run() {
        console.log("Heartbeat", Date.now());
      },
    }),
  )
  .model({
    sign: t.Object(
      {
        username: t.String(),
        password: t.String(),
      },
      {
        description: "Expected an username and password",
      },
    ),
  })
  .onError(({ code, error, set }) => {
    if (code === "NOT_FOUND") {
      set.status = 404;
      return "Not Found :(";
    }
  })
  .post("/error", () => {
    throw new NotFoundError();
  })
  .get(
    "/get",
    async ({ query }) => {
      // Find the user by their unique id
      const user = await User.findOne({ id: query.id });
      return { data: user };
    },
    {
      // headers: "sign",
      query: t.Object({ id: t.String() }),
    },
  )
  .get(
    "/getByPrisma",
    async ({ query }) => {
      // Find the user by their unique id
      const user = await prisma.users.findFirst({
        where: { id_: query.id },
      });
      return { data: user };
    },
    {
      query: t.Object({ id: t.String() }),
    },
  )
  .get("/id/:id", ({ params: { id }, getDate, store }) => ({
    data: {
      id,
      date: getDate(),
      version: store.version,
    },
  }))
  .get("/", () => "hello")
  .get("/jsx", () => (
    <html lang="en">
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h1>Hello World</h1>
        <button onclick={`alert("getDate");`}>Ok</button>
      </body>
    </html>
  ))
  .listen(
    {
      // port: process.env.PORT ?? 3000,
      // hostname: "0.0.0.0",
    },
    ({ hostname, port }) => {
      console.log(`🦊 Elysia is running at ${hostname}:${port}`);
    },
  );

export { app };
export type App = typeof app;
