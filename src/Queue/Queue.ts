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

		let queueIndex = this.#queue.findIndex(callback)
		if (queueIndex === -1 || !this.#queue[queueIndex]) { return null }

		let queue = this.#queue[queueIndex]

		this.#queue.splice(queueIndex, 1)

		return queue
	}

	get size() {
		return this.#queue.length
	}
}
