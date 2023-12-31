export interface IQueue<T = any> {
	enqueue(message: T): void
	dequeue(): T | null
	get size(): number
}
