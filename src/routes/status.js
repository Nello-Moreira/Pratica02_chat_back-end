import { updateStatus } from '../data/dataManager.js';

const route = '/status';

function refresh(request, response) {
	const participantName = request.header('User');
	const updated = updateStatus(participantName);
	const date = new Date();

	if (updated) {
		response
			.status(200)
			.send(`Status updated at: ${date.toLocaleString('pt-BR')}`);
	} else {
		response.status(400).send('User not found');
	}
}

const status = {
	route,
	refresh,
};

export default status;
