import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { Consumer } from './Consumer'
import { Message } from '../Message/Message'

let ws: any = {
	send: mock(() => 1),
}

describe('Consumer', () => {
	beforeEach(() => {
		ws.send.mockClear()
	})

	it('should get id', () => {
		const consumer = new Consumer('id', {} as any)
		expect(consumer.id).toBe('id')
	})

	it('should get messageId', () => {
		const consumer = new Consumer('id', ws)
		expect(consumer.messageId).toBeNull()

		const message = new Message('message', {})
		consumer.sendMessage(message)

		expect(consumer.messageId).toBe('message')
	})

	it('should send message, set messageId and is not available', () => {
		const consumer = new Consumer('id', ws)
		const message = new Message('message', { test: true })
		consumer.sendMessage(message)

		expect(ws.send).toHaveBeenCalled()
		expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ test: true }))
		expect(ws.send).toHaveBeenCalledTimes(1)
		expect(consumer.messageId).toBe(message.id)
		expect(consumer.available).toBeFalse()
	})

	it('should get available', () => {
		const consumer = new Consumer('id', ws)

		expect(consumer.available).toBeTrue()
	})
})
