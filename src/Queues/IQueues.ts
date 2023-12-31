import { IConsumer } from "../Consumer/IConsumer"
import { IQueue } from "../Queue/IQueue"

export interface IQueues<TData = any> {
	addQueue(topic: string, queue: IQueue<TData>): void
	addConsumer(consumer: IQueue<TData>): void
	getQueue(topic: string): IQueue<TData>
	getConsumers(): IConsumer[]
	getConsumerByCallback(callback: (consumer: IConsumer) => boolean): IConsumer | null
}
