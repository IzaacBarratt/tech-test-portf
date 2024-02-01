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
import { Task, Subtask } from "nexus-prisma";

export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const schema = makeSchema({
  types: [
    DateTime,
    objectType({
      name: "Query",
      definition(t) {
        t.list.field("getTasks", {
          type: "Task",
          resolve: (_parent, args, ctx: Context) => {
            return ctx.prisma.task.findMany({
              include: { subtasks: true },
            });
          },
        }),
          t.field("getTask", {
            type: "Task",
            args: {
              id: nonNull(intArg()),
            },
            resolve: (_parent, args, ctx: Context) => {
              return ctx.prisma.task.findUnique({
                where: { id: args.id },
                include: { subtasks: true },
              });
            },
          });
      },
    }),
    objectType({
      name: "Mutation",
      definition(t) {
        t.nonNull.field("deleteTask", {
          type: "Task",
          args: {
            id: nonNull(intArg()),
          },
          resolve: (_, args, ctx: Context) => {
            return ctx.prisma.task.delete({
              where: {
                id: args.id,
              },
            });
          },
        }),
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
        t.nonNull.field("updateTask", {
          type: "Task",
          args: {
            status: stringArg(),
            id: nonNull(intArg()),
          },
          resolve: (_, args, ctx: Context) => {
            return ctx.prisma.task.update({
              where: {
                id: args.id,
              },
              data: {
                status: args.status,
              },
            });
          },
        });
        t.nonNull.field("createSubtask", {
          type: "Subtask",
          args: {
            taskId: nonNull(intArg()),
            title: nonNull(stringArg()),
            status: nonNull(stringArg()),
          },
          resolve: (_, args, ctx: Context) => {
            return ctx.prisma.subtask.create({
              data: {
                task_id: args.taskId,
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
        t.list.field("subtasks", {
          type: "Subtask",
        });
      },
    }),
    objectType({
      name: Subtask.$name,
      description: Subtask.$description,
      definition(t) {
        t.nonNull.field(Subtask.id);
        t.nonNull.field(Subtask.task_id);
        t.nonNull.field(Subtask.title);
        t.nonNull.field(Subtask.status);
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
