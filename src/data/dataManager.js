import fs from 'fs';

import { cleanString, getTime } from '../helpers.js';

const data = {
	participants: [
		{
			name: 'a',
			lastStatus: Date.now(),
		},
	],
	messages: [
		{
			from: 'João',
			to: 'Todos',
			text: 'oi galera',
			type: 'message',
			time: '20:04:37',
		},
	],
};

const databasePath = './src/data/database.json';

function getStoredData() {
	return JSON.parse(fs.readFileSync(databasePath, 'utf-8'));
}

function saveData(data) {
	fs.writeFileSync(databasePath, JSON.stringify(data), 'utf-8');
	return true;
}

function storeParticipant(participant) {
	const data = getStoredData();

	if (typeof participant.name !== typeof '') return 400;

	participant.name = cleanString(participant.name);

	if (participant.name.length === 0) return 400;

	if (data.participants.find(p => p.name === participant.name)) return 409;

	participant.lastStatus = Date.now();
	data.participants.push(participant);

	saveData(data);

	storeMessage({
		from: participant.name,
		to: 'Todos',
		text: 'entra na sala...',
		type: 'status',
	});

	return 200;
}

function hasEmptyField(message) {
	for (let field in message) {
		if (message[field].length === 0) {
			return true;
		}
	}
	return false;
}

function validUserMessageType(message) {
	if (message.type === 'message' || message.type === 'private_message') {
		return true;
	}
	return false;
}

function validMessageSender(message) {
	const data = getStoredData();
	return data.participants.find(p => p.name === message.from);
}

function storeMessage(message) {
	const data = getStoredData();

	message = { ...message, time: getTime() };

	data.messages.push(message);
	saveData(data);
}

function storeUserMessage(message) {
	if (
		hasEmptyField(message) ||
		!validUserMessageType(message) ||
		!validMessageSender(message)
	) {
		return 400;
	}
	storeMessage(message);
	return 200;
}

function getStoredMessages(numberOfMessages, participant) {
	const data = getStoredData();

	data.messages = data.messages.filter(
		m =>
			m.to === participant ||
			m.from === participant ||
			m.type !== 'private_message'
	);

	if (!numberOfMessages) return data.messages;

	const lastIndex = data.messages.length - 1;
	return data.messages.slice(lastIndex - numberOfMessages);
}

function updateStatus(participantName) {
	const data = getStoredData();
	let found = false;

	data.participants = data.participants.map(participant => {
		if (participant.name === participantName) {
			participant.lastStatus = Date.now();
			found = true;
		}
		return participant;
	});
	saveData(data);
	return found;
}

function printLogoutMessage(participant) {
	storeMessage({
		from: participant.name,
		to: 'Todos',
		text: 'sai da sala...',
		type: 'status',
	});
}

function removeInactiveParticipants() {
	const maximumInactiveTimeInSeconds = 10;

	const data = getStoredData();

	data.participants = data.participants.filter(
		participant =>
			Date.now() - participant.lastStatus <
			maximumInactiveTimeInSeconds * 1000
	);

	saveData(data);
}

export {
	getStoredData,
	storeParticipant,
	storeUserMessage,
	getStoredMessages,
	updateStatus,
	removeInactiveParticipants,
};
