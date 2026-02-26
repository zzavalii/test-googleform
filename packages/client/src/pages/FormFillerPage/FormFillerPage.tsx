import { useParams, useNavigate } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation } from '../../api/enhancedApi';
import type { Question } from '../../api/generated';
import { useState } from 'react';
import styles from './FormFillerPage.module.scss';
import Button from '../../components/Button/Button';
import { buildResponsePayload } from '../../utils/answerProcessing';
import PageHeader from '../../components/PageHeader/PageHeader';

const FormFillerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetFormQuery({ id: id! });
    const form = data?.form;

    const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();
    const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({});

    if (isLoading) return <p>Loading form...</p>;
    if (error || !form) return <p>Form not found</p>;

    const handleChange = (
        questionId: string,
        value: string | number | string[]
        ) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const responsePayload = buildResponsePayload(form.id, form.questions, answers);

        try {
            await submitResponse(responsePayload).unwrap();
            alert('Form submitted successfully!');
            navigate('/');
        } catch (err) {
            console.error('Submit error:', err);
            alert('Failed to submit form.');
        }
    };

    return (
        <>
        <PageHeader 
            title={form.title} 
            subtitle={form.description || undefined}
        >
            <Button onClick={() => navigate('/')} variant='primary'>
                Back to Home
            </Button>
        </PageHeader>

        <div className={styles.container}>
            <form onSubmit={handleSubmit}>
                {form.questions.map((q: Question) => {
                    const options = q.options?.filter((o): o is string => o != null) || [];

                    return (
                        <div key={q.id} className={styles.question}>
                            <label>{q.text}</label>

                            {q.type === "TEXT" && (
                                <input
                                    type="text"
                                    value={(answers[q.id] as string) || ''}
                                    onChange={e => handleChange(q.id, e.target.value)}
                                    required
                                />
                            )}

                            {q.type === "CHECKBOX" && (
                                options.map((option, index) => (
                                    <div key={`${q.id}-radio-${index}`}>
                                        <input
                                            type="radio"
                                            id={`${q.id}-radio-${index}`}
                                            name={q.id}
                                            value={index}
                                            checked={answers[q.id] === index}
                                            onChange={() => handleChange(q.id, index)}
                                            required
                                        />
                                        <label htmlFor={`${q.id}-radio-${index}`}>
                                            {option}
                                        </label>
                                    </div>
                                ))
                            )}

                            {q.type === "MULTIPLE_CHOICE" && (
                                <div>
                                    {options.map((option, index) => {
                                        const uniqueValue = `${index}:${option}`;
                                        const prev = (answers[q.id] as string[]) || [];
                                        const checked = prev.includes(uniqueValue);

                                        return (
                                            <div key={`${q.id}-checkbox-${index}`}>
                                                <input
                                                    type="checkbox"
                                                    id={`${q.id}-checkbox-${index}`}
                                                    checked={checked}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            handleChange(q.id, [...prev, uniqueValue]);
                                                        } else {
                                                            handleChange(q.id, prev.filter(v => v !== uniqueValue));
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`${q.id}-checkbox-${index}`}>{option}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {q.type === "DATE" && (
                                <input
                                    type="date"
                                    min="1900-01-01"
                                    max="2100-12-31"
                                    value={(answers[q.id] as string) || ''}
                                    onChange={e => handleChange(q.id, e.target.value)}
                                    required
                                />
                            )}
                        </div>
                    );
                })}

                <Button
                    disabled={isSubmitting}
                    type='submit'
                    variant='primary'
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </form>
        </div>
        </>
    );
};

export default FormFillerPage;