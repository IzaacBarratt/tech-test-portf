import Head from "next/head";
import styles from "../../styles/Home.module.css";
import taskStyles from "../../styles/TaskList.module.css";
import { useQuery, gql as graphql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Subtask, Task } from "@prisma/client";
import CreateTaskForm from "../../components/CreateTaskForm";

const GET_TASK = graphql(`
  query GetTask($id: Int!) {
    getTask(id: $id) {
      id
      title
      description
      status 
      createdAt 
      subtasks {
        status
        id
        title
      }
    }
  }
`);

const CREATE_SUBTASK = graphql(`
  mutation CreateSubtask($taskId: Int!, $title: String!, $status: String!) {
    createSubtask(taskId: $taskId, title: $title, status: $status) {
      id
      status
      title
    }
  }
`)

export default function Task() {
  const { query } = useRouter();

  const taskId =
    typeof query["taskId"] === "string" ? query["taskId"] : undefined;

  const { data, error } = useQuery(GET_TASK, {
    variables: taskId ? { id: Number(taskId) } : undefined,
  });

  const [createSubtaskMutation, { loading: subtaskCreateLoading, error: subtaskCreateError }] = useMutation(CREATE_SUBTASK, {
    refetchQueries: [GET_TASK]
  })

  function handleSubtaskCreate(data) {
    createSubtaskMutation({
      variables: {
        ...data,
        taskId: Number(taskId)
      }
    })
  }

  if (error) {
    return <h4>{error.message}</h4>
  }

  if (!data) {
    return null
  }
  if (!data.getTask) {
    return <h1>Record not found (404)</h1>
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

        <CreateTaskForm
          taskType={"SUBTASK"}
          onFormSubmit={handleSubtaskCreate}
          loading={subtaskCreateLoading}
          error={subtaskCreateError?.message}
        />

        <div className={taskStyles.taskContainer}>
          <p>Subtasks: {data.getTask.subtasks.length}</p>
          <ul>
            {data.getTask.subtasks.map((n: Subtask) => (
              <li key={n.id + '-subtask__task-' + n.task_id} className={styles.card}>
                <h2>{n.title}</h2>
                <p>{n.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
