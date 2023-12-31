import { Consumer } from "./Consumer/Consumer"
import { Message } from "./Message/Message"

let consumers: Consumer[] = []
let queues: Message[] = []

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
			const body = await req.json()

			queues.push(new Message(crypto.randomUUID(), {
				queue: queue,
				data: body,
			}))

			consumers[0].sendMessage(queues[queues.length - 1])

			return new Response('', { status: 201 });
		} catch (e: any) {
			if (e instanceof SyntaxError) {
				return Response.json(
					{ message: 'Body empty' },
					{ status: 400 }
				)
			}
			console.log(e)
		}
		return Response.json(
			{ message: 'Request Error' },
			{ status: 400 }
		)


	},
	websocket: {
		open(ws) {
			consumers.push(new Consumer(ws.data.consumerId, ws))
			ws.subscribe(ws.data.queue);

			const openMsg = `new consumer: ${ws.data?.consumerId ?? 'guest'}`
			console.log(openMsg)
		},

		message(ws, message) {
			try {
				const messageJson: any = JSON.parse(message.toString())
				if (messageJson?.success) {
					queues = queues.filter((queue) =>
						queue.id !== consumers.find((consumer) =>
							consumer.id === ws.data.consumerId
						)?.messageId
					)
				}
			} catch (e: any) {
				console.log(e)
			}
		},

		close(ws) {
			ws.unsubscribe(ws.data.queue);
			console.log(`Disconnect consumer: ${ws.data.consumerId}`)

			consumers = consumers.filter((consumer) => {
				return consumer.id != ws.data.consumerId
			})
		},
	},
	port: 3000
})
