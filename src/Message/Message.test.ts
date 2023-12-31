import { describe, expect, it } from "bun:test";
import { Message } from "./Message";
import { sleep } from "../helpers/sleep";

describe("Message", () => {
	it("should set consumer", () => {
		const message = new Message("messageId", {})
		message.consumer = "consumerId"

		expect(message.consumerId).toBe("consumerId")
	})

	it("should get json", () => {
		const message = new Message("messageId", {
			test: true
		})

		expect(message.json).toBe('{"test":true}')
	})

	it("should get message id", () => {
		const message = new Message("messageId", {})

		expect(message.id).toBe("messageId")
	})

	it("should prevent error when parsing json fails", () => {
		const message = new Message("messageId", Symbol())

		expect(message.json).toBe(null)
	})

	it("should return true if message is available", () => {
		const message = new Message("messageId", {})

		expect(message.available).toBe(true)
	})

	it("should return false if message is has consumerId", () => {
		const message = new Message("messageId", {})
		message.consumer = "consumerId"

		expect(message.available).toBe(false)
	})

	it("should return false if message is has retryAgain and be available after 0.01 seconds", async () => {
		const message = new Message("messageId", {}, 0.01)
		message.failed()
		expect(message.available).toBe(false)
		await sleep(20)
		expect(message.available).toBe(true)
	})

	it("should return false if message is has consumerId and retryAgain", () => {
		const message = new Message("messageId", {})
		message.failed()
		message.consumer = "consumerId"

		expect(message.available).toBe(false)
	})
})
