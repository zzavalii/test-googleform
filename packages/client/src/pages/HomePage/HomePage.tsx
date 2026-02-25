import { useNavigate } from 'react-router-dom';
import { useGetFormsQuery} from '../../api/generated';
import styles from './Homepage.module.scss';

const Homepage = () => {
    const { data, isLoading, error } = useGetFormsQuery();
    const navigate = useNavigate();

    console.log('Query state:', { data, isLoading, error });

    if (isLoading) return <div className={styles.loading}>Loading forms...</div>;
    if (error) return <div className={styles.error}>Error loading forms: {JSON.stringify(error)}</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>All Forms</h1>
                <button onClick={() => navigate('/forms/new')} className={styles.createButton}>
                    + Create New Form
                </button>
            </header>

            <div className={styles.formsList}>
                {data?.forms && data.forms.length > 0 ? (
                    data.forms.map((form) => (
                        <div key={form.id} className={styles.formCard}>
                            <h2>{form.title}</h2>
                            <p>{form.description || 'No description'}</p>
                            <div className={styles.actions}>
                                <button onClick={() => navigate(`/forms/${form.id}/fill`)}>
                                    Fill Form
                                </button>
                                <button onClick={() => navigate(`/forms/${form.id}/responses`)}>
                                    View Responses
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>
                        <p>No forms yet. Create your first form!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;