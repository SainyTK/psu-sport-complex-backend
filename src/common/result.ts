import { HttpStatus } from '@nestjs/common';

export class Result {

    private title: string;

    constructor(title) {
        this.title = title;
    }

    badRequest() {
        const status = HttpStatus.BAD_REQUEST;
        return {
            status: status,
            response: {
                error: 'Bad Request'
            }
        };
    }

    success(action, data = null) {
        const status = HttpStatus.OK;
        let result = {};
        if (action)
            result = { message: `${action} successfully` };
        if (data)
            result = { ...result, data };
        return {
            status: status,
            response: result
        };
    }

    found(data) {
        const status = HttpStatus.OK;
        return {
            status: status,
            response: data
        };
    }

    notFound() {
        const status = HttpStatus.NOT_FOUND;
        return {
            status: status,
            response: {
                error: `Not Found`
            }
        };
    }

    exist(data = null) {
        const status = HttpStatus.CREATED;
        let result;
        result = {
            message: `${this.title} is already exist`,
        };
        if (data) {
            result = {
                ...result,
                data,
            }
        }
        return {
            status: status,
            response: result
        };
    }

}