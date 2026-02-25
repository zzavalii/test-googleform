import { useParams, useNavigate } from 'react-router-dom';
import { useGetResponsesQuery, useGetFormQuery } from '../../api/generated';
import type { Response, Answer, Question } from '../../api/generated';
import styles from './FormResponsesPage.module.scss';

const FormResponsesPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    if (!id) return <div className={styles.error}>Invalid form ID</div>;

    const { data: formData, isLoading: formLoading } = useGetFormQuery({ id });
    const form = formData?.form;

    const { data: responsesData, isLoading: responsesLoading } = useGetResponsesQuery({ formId: id });
    const responses = responsesData?.responses;

    if (formLoading || responsesLoading) {
        return <div className={styles.loading}>Loading responses...</div>;
    }

    if (!form) {
        return <div className={styles.error}>Form not found</div>;
    }

    const getAnswerDisplay = (answer: Answer): string => {
        if (answer.values !== null && answer.values !== undefined && Array.isArray(answer.values)) {
            const validValues = answer.values.filter(
                (v): v is string => typeof v === 'string' && v !== null && v.trim() !== ''
            );
            
            return validValues.length > 0 ? validValues.join(', ') : '(No answer)';
        }
        
        if (answer.value !== null && answer.value !== undefined && typeof answer.value === 'string' && answer.value.trim() !== '') {
            return answer.value;
        }
        
        return '(No answer)';
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.responseBlock}>
                    <h1>Responses for: {form.title}</h1>
                    {form.description && <p className={styles.description}>{form.description}</p>}
                </div>
                <button onClick={() => navigate('/')} className={styles.backButton}>
                    Back to Home
                </button>
            </header>

            <div className={styles.stats}>
                <p>Total Responses: <strong>{responses?.length || 0}</strong></p>
            </div>

            {!responses || responses.length === 0 ? (
                <div className={styles.empty}>
                    <p>No responses yet.</p>
                    <button 
                        onClick={() => navigate(`/forms/${id}/fill`)} 
                        className={styles.fillButton}
                    >
                        Fill this form
                    </button>
                </div>
            ) : (
                <div className={styles.responsesList}>
                    {responses.map((response: Response, responseIndex) => (
                        <div key={response.id} className={styles.responseCard}>
                            <h3 className={styles.responseHeader}>
                                Response #{responseIndex + 1}
                            </h3>
                            
                            <div className={styles.answersGrid}>
                                {response.answers.map((answer: Answer) => {
                                    const question = form.questions.find(
                                        (q: Question) => q.id === answer.questionId
                                    );
                                    
                                    if (!question) return null;

                                    const displayValue = getAnswerDisplay(answer);

                                    return (
                                        <div key={answer.questionId} className={styles.answerItem}>
                                            <div className={styles.questionText}>
                                                {question.text}
                                            </div>
                                            <div className={styles.answerText}>
                                                {displayValue}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormResponsesPage;