import { IQueue } from './IQueue'

export class Queue<T> implements IQueue<T> {
	#queue: T[] = []

	enqueue(item: T) {
		this.#queue.push(item)
	}

	dequeue(callback?: (item: T) => void): T | null {
		if (!callback) {
			return this.#queue.shift() ?? null
		}

		let queueIndex = this.#queue.findIndex((item) => callback(item))
		if (queueIndex === -1) { return null }

		let queue = this.#queue[queueIndex]

		this.#queue.splice(queueIndex, 1)

		return queue ?? null
	}

	get size() {
		return this.#queue.length
	}
}
