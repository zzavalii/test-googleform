import { useParams, useNavigate } from 'react-router-dom';
import { useGetFormQuery, useSubmitResponseMutation } from '../../api/generated';
import type { Question } from '../../api/generated';
import { useState } from 'react';
import styles from './FormFillerPage.module.scss';

const FormFillerPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetFormQuery({ id: id! });
    const form = data?.form;

    const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation();
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

    if (isLoading) return <p>Loading form...</p>;
    if (error || !form) return <p>Form not found</p>;

    const handleChange = (questionId: string, value: string | string[]) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const responsePayload = {
            formId: form.id,
            answers: form.questions.map(q => {
                const answer = answers[q.id];
                
                if (q.type === "CHECKBOX") {
                    const checkboxValues = Array.isArray(answer)
                        ? answer.map(uniqueVal => {
                            const parts = uniqueVal.split(':');
                            return parts.slice(1).join(':');
                        })
                        : [];
                    
                    return {
                        questionId: q.id,
                        value: undefined,
                        values: checkboxValues,
                    };
                }
                
                return {
                    questionId: q.id,
                    value: typeof answer === 'string' ? answer : '',
                    values: undefined,
                };
            }),
        };

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
        <div className={styles.container}>
            <h1>{form.title}</h1>
            {form.description && <p>{form.description}</p>}

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

                            {q.type === "MULTIPLE_CHOICE" && (
                                options.map((option, index) => (
                                    <div key={`${q.id}-radio-${index}`}>
                                        <input
                                            type="radio"
                                            id={`${q.id}-radio-${index}`}
                                            name={q.id}
                                            value={option}
                                            checked={answers[q.id] === option}
                                            onChange={e => handleChange(q.id, e.target.value)}
                                            required
                                        />
                                        <label htmlFor={`${q.id}-radio-${index}`}>{option}</label>
                                    </div>
                                ))
                            )}

                            {q.type === "CHECKBOX" && (
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
                                    value={(answers[q.id] as string) || ''}
                                    onChange={e => handleChange(q.id, e.target.value)}
                                    required
                                />
                            )}
                        </div>
                    );
                })}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default FormFillerPage;