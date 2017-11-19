const fs = require("fs");

module.exports = class chk{
    static Check(url, props) {
		let result = true;
		let propPath = "./checkList.json";
		let defaultProps = JSON.parse(fs.readFileSync(propPath));
        let urlProps = defaultProps.find(val => val.url === url);
		urlProps.props.forEach(val => {
            result = props[val.name] === undefined ? false : true;
			if (val.type === "int" && result) result = Number.isInteger(props[val.name]);
			if (val.required && result) result = props[val.name] !== undefined;
			if(!result) urlProps.props.length = 0;
        });
        console.log(result);
		return result;
	}
}