import styles from '../styles/TaskPaginator.module.css'

function TaskPaginator(props: { taskId: number }) {
    const { taskId } = props;
    const isBackDisabled = taskId <= 1;
    const isNextDisabled = taskId >= 4;

    function renderNavButton(copy: string, path: number) {
        return <a className={styles.button} href={`/task/${path}`}>{copy}</a>
    }


    return <div className={styles.content}>
        {
            (!isBackDisabled)
                ? renderNavButton('Back', taskId - 1)
                : <p className={`${styles.button} ${styles.buttonDisabled}`}>Back</p>
        }

        <p>{taskId}/{5}</p>

        {
            (!isNextDisabled)
                ? renderNavButton('Next', taskId + 1)
                : <p className={`${styles.button} ${styles.buttonDisabled}`}>Next</p>
        }
    </div>
}

export default TaskPaginator;