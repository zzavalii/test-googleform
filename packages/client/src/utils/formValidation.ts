export const validateForm = (title: string, questions: any[]) => {
    if (!title.trim()) {
        return { valid: false, error: 'Title is required' };
    }
    
    if (questions.length === 0) {
        return { valid: false, error: 'At least one question is required' };
    }
    
    const invalidQuestion = questions.find(q => !q.text.trim());
    if (invalidQuestion) {
        return { valid: false, error: 'All questions must have text' };
    }
    
    return { valid: true };
};

export const prepareQuestions = (questions: any[]) => {
    return questions.map(q => ({
        text: q.text,
        type: q.type,
        options: q.options && q.options.length > 0 ? q.options : undefined,
    }));
};