export interface IMessage {
	set consumer(consumerId: string)
	get id(): string
	get json(): string | null
	get consumerId(): string | null
	get available(): boolean
}
