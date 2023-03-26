import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {UserInfoType} from "../types/user-info.type";
import {
    AnswersResultDetailType,
    QuestionsResultDetailType,
    ResultDetailMainType,
    ResultDetailType
} from "../types/result-detail.type";

export class Check {
    readonly email: string | null;
    readonly testId: string;
    readonly userInfo: UserInfoType | null;
    private resultQuiz: ResultDetailMainType | null;

    constructor() {
        this.email = localStorage.getItem('email');
        this.testId = window.location.hash.split('id=')[1];
        this.userInfo = Auth.getUserInfo();
        this.resultQuiz = null;
        this.init();
    }

    private async init(): Promise<void> {
        if (!this.userInfo) return;
        if (this.testId) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result/details?userId=' + this.userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.resultQuiz = result;
                    this.startCheck()
                    this.showAnswers()
                    this.move()
                }
            } catch (error) {
                return console.log(error)
            }

        }
    }


    private startCheck(): void {
        if (!this.userInfo) return;
        const breadcrumb: HTMLElement | null = document.getElementById('breadcrumbs');
        const checkRespondentInfo: HTMLElement | null = document.getElementById('check-respondent-info');
        if (breadcrumb) {
            breadcrumb.innerText = (this.resultQuiz as ResultDetailMainType).test.name;
        }
        if (checkRespondentInfo) {
            checkRespondentInfo.innerHTML =
                'Тест выполнил <span>' + this.userInfo.fullName + ', '
                + this.email + '</span>';
        }
    }

    private showAnswers(): void {
        if (!this.resultQuiz) return;
        const questions: QuestionsResultDetailType[] | null = (this.resultQuiz as ResultDetailMainType).test.questions;
        questions.forEach((questions: QuestionsResultDetailType) => {
            const questionItem: HTMLElement | null = document.createElement('div');
            if (questionItem) {
                questionItem.className = 'check-question-item';
            }

            /*Рисуем заголовок*/
            const questionTitleElement: HTMLElement | null = document.createElement('div');
            if (questionTitleElement) {
                questionTitleElement.className = 'check-question-title common-title';
                questionTitleElement.innerHTML = '<span>Вопрос ' + questions.id + ':</span> ' + questions.question;
            }

            const checkQuestions: HTMLElement | null = document.getElementById('check-question');
            if (checkQuestions) {
                questionItem.appendChild(questionTitleElement)
                checkQuestions.appendChild(questionItem)
            }
            /*Рисуем инпуты*/
            questions.answers.forEach((answer: AnswersResultDetailType) => {
                const optionElement: HTMLElement | null = document.createElement('div');
                optionElement.className = 'check-question-option';

                const inputId: string = 'answer-' + answer.id;
                const inputElement: HTMLInputElement | null = document.createElement('input');
                if (inputElement) {
                    inputElement.className = 'option-answer';
                    inputElement.setAttribute('id', inputId);
                    inputElement.setAttribute('type', 'radio');
                    inputElement.setAttribute('name', 'answer');
                    inputElement.setAttribute('value', answer.id.toString());
                    inputElement.setAttribute('disabled', 'disabled');
                }

                const labelElement: HTMLElement | null = document.createElement('label');
                const labelId: string = 'label-' + inputId;
                if (labelElement) {
                    labelElement.setAttribute('for', inputId);
                    labelElement.setAttribute('id', labelId);
                    labelElement.innerText = answer.answer;
                }
                if (optionElement) {
                    optionElement.appendChild(inputElement);
                    optionElement.appendChild(labelElement);
                    questionItem.appendChild(optionElement)
                }

                const inputIdEl = document.getElementById(inputId);
                const labelIdEl = document.getElementById(labelId);


                if (answer.correct === true) {
                    if (inputIdEl && labelIdEl) {
                        inputIdEl.style.border = '6px solid #5FDC33';
                        labelIdEl.style.color = '#5FDC33';
                    }
                } else if (answer.correct === false) {
                    if (inputIdEl && labelIdEl) {
                        inputIdEl.style.border = '6px solid #DC3333';
                        labelIdEl.style.color = '#DC3333';
                    }
                }
            })
        })
    }


    private move(): void {
        const checkPrev: HTMLElement | null = document.getElementById('check-prev');
        if (checkPrev) {
            checkPrev.onclick = () => {
                location.href = '#/result?id=' + this.testId;
            }
        }
    }
}
