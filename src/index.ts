import { Consumer } from "./Consumer/Consumer"
import { Message } from "./Message/Message"
import { Queue } from "./Queue/Queue"
import { Queues } from "./Queues/Queues"

let queues: Queues = new Queues()

Bun.serve<any>({
	async fetch(req, server) {
		const { searchParams } = new URL(req.url)

		const queue = searchParams.get('queue') ?? 'default'
		console.log(`connection in queue ${queue}`)

		const data = {
			consumerId: crypto.randomUUID(),
			queue,
		}

		if (server.upgrade(req, { data })) return;

		try {
			const contentType = req.headers.get('content-type')

			if (contentType !== 'application/json') {
				return Response.json(
					{ message: 'Content type not supported' },
					{ status: 400 }
				)
			}

			const body = await req.json()

			let message = new Message(crypto.randomUUID(), {
				queue: queue,
				data: body,
			})

			if (!queues.getQueue(queue))
				queues.addQueue(queue, new Queue())

			queues.getQueue(queue).enqueue(message)

			let consumer = queues.getConsumerByCallback((consumer) => consumer.available)

			if (consumer) {
				let queueC = queues.getQueue(queue).dequeue()
				consumer.sendMessage(queueC)
			}

			return new Response('', { status: 201 });
		} catch (e: any) {
			if (e instanceof SyntaxError) {
				return Response.json(
					{ message: 'Body empty' },
					{ status: 400 }
				)
			}
			console.log(e)
			return Response.json(
				{ message: 'Request Error' },
				{ status: 400 }
			)
		}
	},
	websocket: {
		open(ws) {
			queues.addConsumer(new Consumer(ws.data.consumerId, ws))
			let queue = queues.getQueue(ws.data.queue)?.dequeue()

			if (!queue) return

			queues.getConsumerByCallback(
				(consumer) => consumer.id === ws.data.consumerId
			)?.sendMessage(queue)

		},
		message(ws, message) {
			try {
				const messageJson: any = JSON.parse(message.toString())
				if (messageJson?.success) {
					queues.success(ws.data.consumerId)

					let queue = queues.getQueue(ws.data.queue).dequeue()

					if (!queue) return

					queues.getConsumerByCallback(
						(consumer) => consumer.id === ws.data.consumerId
					)?.sendMessage(queue)
				}
			} catch (e: any) {
				console.log(e)
			}
		},
		close(ws) {
			queues.removeConsumer(ws.data.consumerId)
		},
	},
	port: 3000
})
