import { IMessage } from "../Message/IMessage";

export interface IConsumer {
	get id(): string
	get messageId(): string | null
	get available(): boolean
	sendMessage(queue: IMessage): void
}
