import { beforeEach, describe, expect, it } from "bun:test";
import { Queue } from "./Queue";

describe("Queue", () => {
	let queue: Queue<number>

	beforeEach(() => {
		queue = new Queue()
	})

	it("should add items", () => {
		queue.enqueue(1)
		queue.enqueue(2)
		queue.enqueue(3)

		expect(queue.size).toBe(3)
	})

	it("should dequeue items", () => {
		queue.enqueue(123)
		queue.enqueue(234)
		queue.enqueue(345)

		expect(queue.size).toBe(3)
		expect(queue.dequeue()).toBe(123)
		expect(queue.dequeue()).toBe(234)
		expect(queue.dequeue()).toBe(345)
		expect(queue.size).toBe(0)
	})

	it("should dequeue items by callback", () => {
		for (let i = 1; i <= 5; i++) {
			queue.enqueue(i)
		}

		expect(queue.size).toBe(5)
		expect(queue.dequeue((item) => item % 2 === 0)).toBe(2)
		expect(queue.dequeue((item) => item % 2 === 0)).toBe(4)
		expect(queue.dequeue((item) => item % 2 === 1)).toBe(1)
		expect(queue.size).toBe(2)
	})

	it("should return null when queue is empty", () => {
		expect(queue.dequeue()).toBeNull()
	})

	it("should return null when queue is empty by callback", () => {
		expect(queue.dequeue((item) => item % 2 === 0)).toBe(null)
	})

	it("should return null when callback return always false", () => {
		queue.enqueue(1)
		queue.enqueue(2)
		queue.enqueue(3)

		expect(queue.size).toBe(3)
		expect(queue.dequeue((item) => item === 10)).toBe(null)
		expect(queue.size).toBe(3)
	})
})
