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
                statusCode: status,
                error: 'Bad Request',
            }
        };
    }

    success(action, data = null) {
        const status = HttpStatus.OK;
        let result = {};
        result = { statusCode: status }
        if (action)
            result = { ...result, message: `${action} successfully` };
        if (data)
            result = { ...result, data: data };
        return {
            status: status,
            response: result
        };
    }

    found(data) {
        const status = HttpStatus.OK;
        return {
            status: status,
            response: {
                statusCode: status,
                data: data
            }
        };
    }

    notFound() {
        const status = HttpStatus.NOT_FOUND;
        return {
            status: status,
            response: {
                statusCode: status,
                error: `Not Found`
            }
        };
    }

    exist(data) {
        const status = HttpStatus.CREATED;
        return {
            status: status,
            response: {
                statusCode: status,
                message: `${this.title} is already exist`,
                data: data
            }
        };
    }


}