import { v4 as uuidv4 } from "uuid";
import { Form, Question, Response, Answer } from "../../../shared/src/types";

const forms: Form[] = [];
const responses: Response[] = [];

export const resolvers = {
    Query: {
        forms: () => forms,
        form: (_: any, { id }: { id: string }) => forms.find(f => f.id === id),
        responses: (_: any, { formId }: { formId: string }) =>
            responses.filter(r => r.formId === formId),
    },
    Mutation: {
        createForm: (_: any, { title, description, questions }: { title: string; description?: string; questions: Question[] }) => {
            const newForm: Form = {
                id: uuidv4(),
                title,
                description,
                questions: questions.map(q => ({
                    id: uuidv4(),
                    text: q.text,
                    type: q.type,
                    options: q.options,
                })),
            };
            forms.push(newForm);
            return newForm;
        },
        submitResponse: (_: any, { formId, answers }: { formId: string; answers: Answer[] }) => {
            console.log('submitResponse called with:', { formId, answers });
            
            const newResponse: Response = {
                id: uuidv4(),
                formId,
                answers: answers.map(a => {
                    console.log('Processing answer:', a);
                    
                    return {
                        questionId: a.questionId,
                        value: a.value || undefined,
                        values: a.values || undefined,
                    };
                }),
            };
            
            console.log('Created response:', newResponse);
            
            responses.push(newResponse);
            return newResponse;
        },
    },
};