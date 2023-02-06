export class ResponseSchema {
	constructor(status = 400, data = null, errorText = null) {
		this.data = data;
		this.error = errorText != null ? { message: errorText } : null;
		this.status = status;
	}
}