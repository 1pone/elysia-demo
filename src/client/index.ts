import { edenTreaty } from "@elysiajs/eden";
import type { App } from "../server";

const app = edenTreaty<App>("http://0.0.0.0:8880");

const { data } = await app.id["123"].get();

console.log(data?.data.version);
