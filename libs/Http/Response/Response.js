
export const response = Object.create(null);

response.status = function (status){
	if(!this.getHeader('Content-Type')){
		this.setHeader("Content-Type", "application/json");
	}
	if(status) {
		this.writeHead(status);
		return;
	}
	this.writeHead(200);
}

response.json = function (data){
	let string = data ? data : {};
	this.status(this.statusCode);
	this.end(JSON.stringify(string));
}