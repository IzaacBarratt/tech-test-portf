import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import CreateTaskForm from "../components/CreateTaskForm";
import { useQuery, gql as graphql } from "@apollo/client";
import TaskList from "../components/TaskList";
import { Task } from "@prisma/client";



const GET_TASKS = graphql(`
  query GetTasks {
    getTasks {
      description
      createdAt
      id
      status
      title
    }
  }
`);

export default function Home() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  const { data } = useQuery(GET_TASKS);
  const tasks: Task[] = data?.getTasks

  const toggleCreateTaskForm = () => setIsTaskFormOpen(!isTaskFormOpen)
  const handleTaskCreated = (data: Task) => {
    console.log(data)
    toggleCreateTaskForm();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Task Manager App</title>
        <meta name="description" content="Manage your tasks!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Task Manager</h1>

        <p className={styles.description}>Please read the README.md</p>

        <p className={styles.description}>
          GraphQL API located at
          <a href="/api/graphql" target="_blank">
            <code className={styles.code}>pages/api/graphql.js</code>
          </a>
        </p>

        <button onClick={toggleCreateTaskForm}>+ Create Task +</button>
        {isTaskFormOpen ? <CreateTaskForm onComplete={handleTaskCreated} /> : null}

        {
          (tasks != null && tasks.length > 0)
            ? <TaskList tasks={tasks} />
            : <p>No tasks found</p>
        }


        <p className={styles.description}>
          <a href="/task/1" target="_blank">
            First task
          </a>
        </p>
      </main>
    </div>
  );
}
