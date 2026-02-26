import { useParams, useNavigate } from 'react-router-dom';
import { useGetResponsesQuery, useGetFormQuery } from '../../api/enhancedApi';
import type { Response, Answer, Question } from '../../api/generated';
import styles from './FormResponsesPage.module.scss';
import Button from '../../components/Button/Button';
import PageHeader from '../../components/PageHeader/PageHeader';

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

    const getAnswerDisplay = (answer: Answer, question: Question): string => {
        if (answer.values !== null && answer.values !== undefined && Array.isArray(answer.values)) {
            const validValues = answer.values.filter(
                (v): v is string => typeof v === 'string' && v !== null && v.trim() !== ''
            );
            
            return validValues.length > 0 ? validValues.join(', ') : '(No answer)';
        }
        
        if (answer.value !== null && answer.value !== undefined && typeof answer.value === 'string' && answer.value.trim() !== '') {
            if (question.type === "DATE") {
                const date = new Date(answer.value);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('uk-UA'); 
                }
            }

            return answer.value;
        }
        
        return '(No answer)';
    };

    return (
        <>
            <PageHeader title={`Responses for: ${form.title}`}
                subtitle={form.description || undefined}
                onBackClick={() => navigate('/')}
            />

            <div className={styles.container}>
                <div className={styles.stats}>
                    <p>Total Responses: <strong>{responses?.length || 0}</strong></p>
                </div>

                {!responses || responses.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No responses yet.</p>
                        <Button
                            onClick={() => navigate(`/forms/${id}/fill`)} 
                            variant='primary'
                        >
                            Fill this form
                        </Button>
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

                                        const displayValue = getAnswerDisplay(answer, question);

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
        </>
    );
};

export default FormResponsesPage;