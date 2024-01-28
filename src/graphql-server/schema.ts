import {
  intArg,
  makeSchema,
  objectType,
  asNexusMethod,
  nonNull,
  stringArg,
} from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import { Context } from "./context";
import path from "path";
import { Task } from "nexus-prisma";

export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const schema = makeSchema({
  types: [
    DateTime,
    objectType({
      name: "Query",
      definition(t) {
        t.field("getTask", {
          type: "Task",
          args: {
            id: nonNull(intArg()),
          },
          resolve: (_parent, args, ctx: Context) => {
            return ctx.prisma.task.findUnique({
              where: { id: args.id },
            });
          },
        });
      },
    }),
    objectType({
      name: "Query",
      definition(t) {
        t.field("getTasks", {
          type: "Task",
          resolve: (_parent, args, ctx: Context) => {
            return ctx.prisma.task.findMany();
          },
        });
      },
    }),
    objectType({
      name: "Mutation",
      definition(t) {
        t.nonNull.field("createTask", {
          type: "Task",
          args: {
            description: stringArg(),
            title: nonNull(stringArg()),
            status: nonNull(stringArg()),
          },
          resolve: (_, args, ctx: Context) => {
            return ctx.prisma.task.create({
              data: {
                description: args.description,
                title: args.title,
                status: args.status,
              },
            });
          },
        });
      },
    }),
    objectType({
      name: Task.$name,
      description: Task.$description,
      definition(t) {
        t.nonNull.field(Task.id);
        t.nonNull.field(Task.title);
        t.field(Task.description);
        t.nonNull.field(Task.status);
        t.nonNull.field(Task.createdAt);
      },
    }),
  ],
  outputs: {
    schema: path.join(process.cwd(), "src", "graphql-server", "schema.graphql"),
    typegen: path.join(process.cwd(), "src", "graphql-server", "types.ts"),
  },
  contextType: {
    module: path.join(process.cwd(), "src", "graphql-server", "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
