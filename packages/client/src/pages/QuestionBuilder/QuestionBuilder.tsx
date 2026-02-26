import { useState } from 'react';
import { type QuestionType } from '../../api/generated';
import styles from './QuestionBuilder.module.scss';
import Button from '../../components/Button/Button';

interface Question {
    text: string;
    type: QuestionType;
    options?: string[];
}

interface QuestionBuilderProps {
    question: Question;
    index: number;
    onUpdate: (question: Question) => void;
    onDelete: () => void;
}

const QuestionBuilder = ({ question, index, onUpdate, onDelete }: QuestionBuilderProps) => {
    const [optionInput, setOptionInput] = useState('');

    const handleTypeChange = (newType: QuestionType) => {
        const updatedQuestion: Question = {
            ...question,
            type: newType,
            options: newType === 'MULTIPLE_CHOICE' || newType === 'CHECKBOX'
                ? question.options || []
                : undefined,
        };
        onUpdate(updatedQuestion);
    };

    const addOption = () => {
        if (!optionInput.trim()) return;

        const updatedQuestion: Question = {
            ...question,
            options: [...(question.options || []), optionInput.trim()],
        };
        onUpdate(updatedQuestion);
        setOptionInput('');
    };

    const removeOption = (optionIndex: number) => {
        const updatedQuestion: Question = {
            ...question,
            options: question.options?.filter((_, i) => i !== optionIndex),
        };
        onUpdate(updatedQuestion);
    };

    const requiresOptions = question.type === 'MULTIPLE_CHOICE' ||
        question.type === 'CHECKBOX';

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={styles.questionNumber}>Question {index + 1}</span>
                <Button
                    type="button"
                    onClick={onDelete}
                    className={styles.deleteButton}
                    variant='outline'>
                    ×
                </Button>
            </div>

            <input
                type="text"
                placeholder="Enter question text"
                value={question.text}
                onChange={(e) => onUpdate({ ...question, text: e.target.value })}
                className={styles.questionInput}
                required
            />

            <div className={styles.typeSelector}>
                <label>Question Type:</label>
                <select
                    value={question.type}
                    onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                    className={styles.typeSelect}
                >
                    <option value='TEXT'>Text Input</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="CHECKBOX">Checkboxes</option>
                    <option value="DATE">Date</option>
                </select>
            </div>

            {requiresOptions && (
                <div className={styles.optionsSection}>
                    <label>Options:</label>
                    {question.options && question.options.length > 0 && (
                        <ul className={styles.optionsList}>
                            {question.options.map((option, optionIndex) => (
                                <li key={optionIndex} className={styles.optionItem}>
                                    <span>{option}</span>
                                    <Button
                                        type="button"
                                        onClick={() => removeOption(optionIndex)}
                                        className={styles.removeOptionButton}
                                        variant='outline'>
                                        ×
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className={styles.addOptionForm}>
                        <input
                            type="text"
                            placeholder="Enter option"
                            value={optionInput}
                            onChange={(e) => setOptionInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addOption();
                                }
                            }}
                            className={styles.optionInput}
                        />
                        <Button
                            type="button"
                            onClick={addOption}
                            className={styles.addOptionButton}
                            variant='third'>
                                + Add
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionBuilder;