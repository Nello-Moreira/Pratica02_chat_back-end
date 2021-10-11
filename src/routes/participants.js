import { getStoredData, storeParticipant } from '../data/dataManager.js';

const route = '/participants';

function getParticipants(request, response) {
	response.status(200).send(getStoredData().participants);
}

function login(request, response) {
	const statusCode = storeParticipant(request.body);

	response.status(statusCode);

	if (statusCode === 200) {
		response.send('Sucessfully logged in');
	} else if (statusCode === 400) {
		response.send('Please, enter a valid name');
	} else if (statusCode === 409) {
		response.send('This name is already taken');
	}
}

const participants = {
	route,
	getParticipants,
	login,
};

export default participants;
