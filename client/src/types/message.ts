interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SendMessagePayload {
  text?: string;
  image?: string;
}

export type { Message, SendMessagePayload };
