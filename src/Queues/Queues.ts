import { IConsumer } from "../Consumer/IConsumer"
import { IQueue } from "../Queue/IQueue"

export class Queues<TData = any> {
	#queues: { [key: string]: IQueue<TData> } = {}
	#consumers: IConsumer[] = []

	addQueue(topic: string, queue: IQueue<TData>) {
		console.log(`new queue: ${topic}`)
		this.#queues[topic] = queue
	}

	addConsumer(consumer: IConsumer) {
		this.#consumers.push(consumer)
	}

	getQueue(topic: string): IQueue<TData> {
		return this.#queues?.[topic] ?? null
	}

	getConsumers(): IConsumer[] {
		return this.#consumers
	}

	getConsumerByCallback(callback: (consumer: IConsumer) => boolean): IConsumer | null {
		return this.#consumers.find(callback) ?? null
	}

	removeConsumer(consumerId: string) {
		this.#consumers = this.#consumers.filter((consumer) => consumer.id !== consumerId)
	}

	success(consumerId: string) {
		this.getConsumerByCallback((consumer) => consumer.id === consumerId)
			?.success()
	}
}
