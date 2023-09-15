import { Elysia } from "elysia";
import { apollo, gql } from "@elysiajs/apollo";

export const apolloModel = (app: Elysia) =>
  app.use(
    apollo({
      typeDefs: gql`
        type Book {
          title: String
          author: String
        }

        type Query {
          books: [Book]
        }
      `,
      resolvers: {
        Query: {
          books: () => {
            return [
              {
                title: "Elysia",
                author: "saltyAom",
              },
            ];
          },
        },
      },
    }),
  );
