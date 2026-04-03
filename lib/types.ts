export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: number
  isLoading?: boolean
}

export interface User {
  id: string
  name: string
  status: string
  avatar: string
}
