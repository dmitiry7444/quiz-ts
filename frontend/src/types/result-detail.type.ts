export type ResultDetailMainType = {
    test: ResultDetailType
}

export type ResultDetailType = {
    id: number,
    name: string,
    questions: Array<QuestionsResultDetailType>
}
export type QuestionsResultDetailType = {
    answers: Array<AnswersResultDetailType>,
    id: number,
    question: string,
}
export type AnswersResultDetailType = {
    answer: string,
    correct?: boolean,
    id: number,
}