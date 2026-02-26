import { useNavigate } from 'react-router-dom';
import { useGetFormsQuery} from '../../api/enhancedApi';
import styles from './Homepage.module.scss';
import Button from '../../components/Button/Button';
import PageHeader from '../../components/PageHeader/PageHeader';

const Homepage = () => {
    const { data, isLoading, error } = useGetFormsQuery();
    const navigate = useNavigate();

    console.log('Query state:', { data, isLoading, error });

    if (isLoading) return <div className={styles.loading}>Loading forms...</div>;
    if (error) return <div className={styles.error}>Error loading forms: {JSON.stringify(error)}</div>;

    return (

        <>
            <PageHeader title="All Forms">
                <Button onClick={() => navigate('/forms/new')} variant="primary">
                    + Create New Form
                </Button>
            </PageHeader>

            <div className={styles.container}>
                <div className={styles.formsList}>
                    {data?.forms && data.forms.length > 0 ? (
                        data.forms.map((form) => (
                            <div key={form.id} className={styles.formCard}>
                                <div className={styles.closeTitle}>
                                    <h2>{form.title}</h2>
                                    <p>{form.description || 'No description'}</p>
                                </div>
                                <div className={styles.actions}>
                                    <Button 
                                        onClick={() => navigate(`/forms/${form.id}/fill`)}
                                        variant="secondary"
                                    >
                                        Fill Form
                                    </Button>
                                    <Button 
                                        onClick={() => navigate(`/forms/${form.id}/responses`)}
                                        variant="secondary"
                                    >
                                        View Responses
                                    </Button>
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

            <footer className={styles.footer}>
                <div className={styles.footer__inner}>
                    <div className={styles.copyright}>
                        &copy; 2026 zzavalii
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Homepage;