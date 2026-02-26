export const processCheckboxAnswer = (answer: string[]) => {
    return answer.map(uniqueVal => {
        const parts = uniqueVal.split(':');
        return parts.slice(1).join(':');
    });
};

export const buildResponsePayload = (formId: string, questions: any[], answers: Record<string, any>) => {
    return {
        formId,
        answers: questions.map(q => {
            const answer = answers[q.id];
            
            if (q.type === "MULTIPLE_CHOICE") {
                return {
                    questionId: q.id,
                    value: undefined,
                    values: Array.isArray(answer) ? processCheckboxAnswer(answer) : [],
                };
            }
            
            if (q.type === "CHECKBOX" && typeof answer === 'number') {
                const selectedOption = q.options?.[answer] ?? '';
                return {
                    questionId: q.id,
                    value: selectedOption,
                    values: undefined,
                };
            }

            return {
                questionId: q.id,
                value: typeof answer === 'string' ? answer : '',
                values: undefined,
            };
        }),
    };
};