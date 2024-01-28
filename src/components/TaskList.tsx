import { Task } from "@prisma/client";
import styles from '../styles/Home.module.css';
import taskListStyles from '../styles/TaskList.module.css'


function TaskList(props: { tasks: Task[], onDeleteTask: (id: Number) => void }) {
    const { tasks, onDeleteTask } = props;

    return <div className={taskListStyles.taskContainer}>
        <h5>Tasks: {tasks.length}</h5>
        <ul className={`${styles.grid} `}>
            {tasks?.map((n) => (
                <li className={styles.card} key={n.id + '-task'}>

                    <div className={taskListStyles.header}>
                        <p>{n.id}</p>
                        <button onClick={() => onDeleteTask(n.id)}>Delete</button>
                    </div>
                    <h2 className={styles.title}><a href={"/task/" + n.id}>{n.title}       </a></h2>
                    <p>{n.description}</p>
                    <p>{n.createdAt.toString()}</p>
                    <h4>{n.status}</h4>

                </li>
            ))}
        </ul>
    </div>
}

export default TaskList;