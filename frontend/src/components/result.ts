import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {UserInfoType} from "../types/user-info.type";
import {PassTestResponseType} from "../types/pass-test-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Result {
    readonly testId: string;


    constructor() {
        this.testId = window.location.hash.split('id=')[1];
        this.init();
    }

    private async init(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/'
            return
        }
        if (this.testId) {
            try {
                const result: PassTestResponseType | DefaultResponseType = await CustomHttp.request(config.host + '/tests/' + this.testId + '/result?userId=' + userInfo.userId, 'GET');
                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }

                    const resultScoreElement: HTMLElement | null = document.getElementById('result-score');
                    const resultCorrectElement: HTMLElement | null = document.getElementById('result-correct');

                    if (resultScoreElement) {
                        resultScoreElement.innerText = (result as PassTestResponseType).score + '/' + (result as PassTestResponseType).total;
                    }
                    if (resultCorrectElement) {
                        resultCorrectElement.onclick = () => {
                            location.href = '#/check?id=' + this.testId;
                        }
                    }
                    return
                }
            } catch (error) {
                console.log(error)
            }

        }
        location.href = '#/'
    }
}
