
export const response = Object.create(null);

response.status = function (status = null){
	debugger
	let header = this.getHeader('Content-Type');
	if(!header){
		this.setHeader("Content-Type", "application/json");
	}
	let getStatus = this.statusCode;
	if(getStatus !== status) {
		this.writeHead(status);
	}
}

response.json = function (data){
	debugger
	let string = data ? data : {};
	this.status(this.statusCode);
	this.end(JSON.stringify(string));
}