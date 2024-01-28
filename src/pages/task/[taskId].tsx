import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { useQuery, gql as graphql } from "@apollo/client";
import { useRouter } from "next/router";
import TaskPaginator from '../../components/TaskPaginator'
import { FormEvent, FormEventHandler, useState } from "react";
import CreateTaskForm from "../../components/CreateTaskForm";
import { Task } from "@prisma/client";

const GET_TASK = graphql(`
  query GetTask($id: Int!) {
    getTask(id: $id) {
      id
      title
      description
    }
  }
`);



export default function Task() {
  const { query } = useRouter();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false)

  const taskId =
    typeof query["taskId"] === "string" ? query["taskId"] : undefined;

  const { data } = useQuery(GET_TASK, {
    variables: taskId ? { id: Number(taskId) } : undefined,
  });

  if (!data) {
    return null;
  }

  const toggleCreateTaskForm = () => setIsTaskFormOpen(!isTaskFormOpen)
  const handleTaskCreated = (data: Task) => {
    console.log(data)
    toggleCreateTaskForm();
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Task {data.getTask.id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Task {data.getTask.id}</h1>
        <h2 className={styles.description}>{data.getTask.title}</h2>
        <p className={styles.description}>{data.getTask.description}</p>

        <button onClick={toggleCreateTaskForm}>+ Create Task +</button>
        {isTaskFormOpen ? <CreateTaskForm onComplete={handleTaskCreated} /> : null}
        <TaskPaginator taskId={Number(taskId || 1)} />

      </main>
    </div>
  );
}
