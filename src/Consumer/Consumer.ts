import { ServerWebSocket } from "bun"
import { IConsumer } from "./IConsumer"
import { IMessage } from "../Message/IMessage"

export class Consumer implements IConsumer {
	#id
	#messageId: string | null = null
	ws

	constructor(consumerId: string, ws: ServerWebSocket<any>) {
		this.#id = consumerId
		this.ws = ws
	}

	get id() {
		return this.#id
	}

	get messageId() {
		return this.#messageId
	}

	success() {
		this.#messageId = null
	}

	sendMessage(message: IMessage) {
		console.log(`Send message: ${message.id} to consumer: ${this.#id}`)
		message.consumer = this.#id
		this.#messageId = message.id

		this.ws.send(message.json ?? '')
	}

	get available() {
		return !this.#messageId
	}
}
