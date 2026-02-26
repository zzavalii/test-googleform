import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFormMutation } from '../../api/enhancedApi';
import { type QuestionType } from '../../api/generated';
import QuestionBuilder from '../QuestionBuilder/QuestionBuilder';
import styles from './FormBuilderPage.module.scss';

import { validateForm, prepareQuestions } from '../../utils/formValidation';
import Button from '../../components/Button/Button';
import PageHeader from '../../components/PageHeader/PageHeader';

interface Question {
    text: string;
    type: QuestionType;
    options?: string[];
}

const FormBuilderPage = () => {
    const navigate = useNavigate();
    const [createForm, { isLoading }] = useCreateFormMutation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { text: '', type: "TEXT", options: [] },
        ]);
    };

    const updateQuestion = (index: number, updatedQuestion: Question) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQuestion;
        setQuestions(newQuestions);
    };

    const deleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateForm(title, questions);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        try {
            await createForm({
                title,
                description: description || undefined,
                questions: prepareQuestions(questions),
            }).unwrap();

            alert('Form created successfully!');
            navigate('/');
        } catch (error) {
            console.error('Failed to create form:', error);
            alert('Failed to create form. Please try again.');
        }
    };

    return (
        <>
        <PageHeader title='New Form'>
            <Button onClick={() => navigate('/')} variant='primary'>
                Back to Home
            </Button>
        </PageHeader>

        <div className={styles.container}>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formHeader}>
                    <input
                        type="text"
                        placeholder="Form Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.titleInput}
                        required
                    />
                    <textarea
                        placeholder="Form Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.descriptionInput}
                        rows={3}
                    />
                </div>

                <div className={styles.questionsSection}>
                    <h2>Questions</h2>
                    {questions.map((question, index) => (
                        <QuestionBuilder
                            key={index}
                            question={question}
                            index={index}
                            onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                            onDelete={() => deleteQuestion(index)}
                        />
                    ))}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className={styles.addQuestionButton}
                    >
                        + Add Question
                    </button>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitButton}
                    >
                        {isLoading ? 'Creating...' : 'Create Form'}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default FormBuilderPage;