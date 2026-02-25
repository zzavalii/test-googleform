import { gql } from "apollo-server-express";

export const typeDefs = gql`
    enum QuestionType {
        TEXT
        MULTIPLE_CHOICE
        CHECKBOX
        DATE
    }

    type Question {
        id: ID!
        text: String!
        type: QuestionType!
        options: [String]
    }

    input QuestionInput {
        text: String!
        type: QuestionType!
        options: [String]
    }

    type Form {
        id: ID!
        title: String!
        description: String
        questions: [Question!]!
    }

    type Answer {
        questionId: ID!
        value: String
        values: [String]
    }

    input AnswerInput {
        questionId: ID!
        value: String
        values: [String]
    }

    type Response {
        id: ID!
        formId: ID!
        answers: [Answer!]!
    }

    type Query {
        forms: [Form!]!
        form(id: ID!): Form
        responses(formId: ID!): [Response!]!
    }

    type Mutation {
        createForm(title: String!, description: String, questions: [QuestionInput!]!): Form!
        submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
    }
`;
