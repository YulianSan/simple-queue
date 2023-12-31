import { IMessage } from "./IMessage"

export class Message implements IMessage {
	#id
	#consumerId: string | null = null
	#data
	#retryAgain: number | null = null
	#seconds: number = 5

	constructor(messageId: string, data: any, seconds = 5) {
		this.#id = messageId
		this.#data = data
		this.#seconds = seconds
	}

	set consumer(consumerId: string) {
		this.#consumerId = consumerId
	}

	failed() {
		this.#retryAgain = Date.now() + this.#seconds * 1000
		this.#consumerId = null
	}

	get id() {
		return this.#id
	}

	get json() {
		try {
			return JSON.stringify(this.#data) ?? null
		}
		catch (e: any) {
			console.log(e?.message ?? e)
			return null
		}
	}

	get consumerId() {
		return this.#consumerId
	}

	get available() {
		return (this.#consumerId === null && !this.#retryAgain)
			|| (!!this.#retryAgain && this.#retryAgain < Date.now())
	}
}
