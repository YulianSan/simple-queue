import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { Consumer } from './Consumer'

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

		const message = {
			id: 'message',
			consumer: 'id',
			json: JSON.stringify({ test: true }),
		}

		consumer.sendMessage(message as any)

		expect(consumer.messageId).toBe('message')
	})

	it('should send message, set messageId and is not available', () => {
		const consumer = new Consumer('id', ws)

		const mockJson = mock(() => JSON.stringify({ test: true }))

		const message = {
			id: 'message',
			consumer: 'id',
			get json() { return mockJson() },
		}

		consumer.sendMessage(message as any)

		expect(ws.send).toHaveBeenCalled()
		expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ test: true }))
		expect(ws.send).toHaveBeenCalledTimes(1)
		expect(mockJson).toHaveBeenCalledTimes(1)
		expect(consumer.messageId).toBe(message.id)
		expect(consumer.available).toBeFalse()
	})

	it('should get available', () => {
		const consumer = new Consumer('id', ws)

		expect(consumer.available).toBeTrue()
	})
})
