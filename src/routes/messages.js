import { getStoredMessages, storeUserMessage } from '../data/dataManager.js';

const route = '/messages';

function getMessages(request, response) {
	const messages = getStoredMessages(
		request.query.limit,
		request.header('User')
	);
	response.status(200).send(messages);
}

function postMessage(request, response) {
	const message = { from: request.header('User'), ...request.body };
	const statusCode = storeUserMessage(message);
	response.status(statusCode);

	if (statusCode === 200) {
		response.send('Message sent');
	}
	if (statusCode === 400) {
		response.send('An error has ocurred');
	}
}

const messages = {
	route,
	getMessages,
	postMessage,
};

export default messages;
