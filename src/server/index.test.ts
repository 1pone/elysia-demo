import { describe, expect, it } from "bun:test";
import { app } from "./index";

describe("Elysia", () => {
  it("return a response", async () => {
    const response = await app
      .handle(new Request("http://0.0.0.0:8800/"))
      .then((res) => res.text());

    expect(response).toBe("hello");
  });
});
