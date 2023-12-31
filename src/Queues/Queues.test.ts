import { describe, it, expect, mock } from 'bun:test'
import { Queues } from './Queues'

describe('Queues', () => {
	it('should add queue', () => {
		const queues = new Queues()
		queues.addQueue('test', {} as any)

		expect(queues.getQueue('test')).not.toBeNull()
	})

	it('should add consumer', () => {
		const queues = new Queues()
		queues.addConsumer({} as any)

		expect(queues.getConsumers().length).toBe(1)
	})

	it('should get consumer by callback', () => {
		const queues = new Queues()
		queues.addConsumer({ id: '0' } as any)
		queues.addConsumer({ id: '2' } as any)
		queues.addConsumer({ id: '1' } as any)

		expect(queues.getConsumerByCallback((consumer) => consumer.id === '1'))
			.not.toBeNull()
	})

	it('should get consumers', () => {
		const queues = new Queues()
		queues.addConsumer({ id: '0' } as any)
		queues.addConsumer({ id: '2' } as any)
		queues.addConsumer({ id: '1' } as any)

		expect(queues.getConsumers()).toBeArray()
		expect(queues.getConsumers().length).toBe(3)
		expect(queues.getConsumers()[0].id).toBe('0')
		expect(queues.getConsumers()[1].id).toBe('2')
		expect(queues.getConsumers()[2].id).toBe('1')
	})

	it('should get queue', () => {
		const queues = new Queues()
		queues.addQueue('1', {} as any)
		queues.addQueue('2', {} as any)
		queues.addQueue('3', {} as any)

		expect(queues.getQueue('1')).not.toBeNull()
		expect(queues.getQueue('2')).not.toBeNull()
		expect(queues.getQueue('3')).not.toBeNull()
	})

	it('should return null if queue does not exist', () => {
		const queues = new Queues()

		expect(queues.getQueue('test')).toBeNull()
	})

	it('should return null if consumer does not exist', () => {
		const queues = new Queues()

		expect(queues.getConsumerByCallback((consumer) => consumer.id === '1'))
			.toBeNull()
	})

	it('should remove consumer', () => {
		const queues = new Queues()
		queues.addConsumer({ id: '1' } as any)

		queues.removeConsumer('1')

		expect(queues.getConsumers().length).toBe(0)
		expect(queues.getConsumerByCallback((consumer) => consumer.id === '1'))
			.toBeNull()
	})

	it('should call success', () => {
		const queues = new Queues()
		const mockSuccess = mock(() => { })
		queues.addConsumer({
			id: '1',
			success() { return mockSuccess() },
		} as any)

		queues.success('1')

		expect(mockSuccess).toHaveBeenCalled()
		expect(mockSuccess).toHaveBeenCalledTimes(1)
	})
})
