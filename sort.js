var sortField;

Array.prototype.sortByField = function(type, field){
    if (type !== "asc" && type !== "desc") throw "Incorrect sort type!";
	if (this[0][field] === undefined) throw "Incorrect sort field";

	let result = this;
	sortField = field;

	result = this.sort(
		Number.isInteger(this[0][field]) ? compareNumber : compareString
	);

	result = type === "desc" ? result.reverse() : result;

	return result;
}

const compareNumber = (cur, prev) => {
	return cur[sortField] - prev[sortField];
};

const compareString = (cur, prev, field) => {
	return cur[sortField].localeCompare(prev[sortField]);
};