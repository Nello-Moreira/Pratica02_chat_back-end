function removeHTMLTags(str) {
	const cleannerRegex = /(<([^>]+)>)/gi;

	return str.replace(cleannerRegex, '');
}

function cleanString(str) {
	if (typeof str !== typeof '') {
		return str;
	}
	str = removeHTMLTags(str);
	return str.trim();
}

function getTime() {
	const date = new Date();

	return date.toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
}

export { cleanString, getTime };
