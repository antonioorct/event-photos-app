export class ApiError {
    status: number;
    message?: string;
    errors?: Error[];

    constructor(options: ApiError) {
        this.status = options.status;

        this.errors = options.errors;

        Object.defineProperty(this, "message", {
            enumerable: true,
            value: options.message,
        });
    }
}
