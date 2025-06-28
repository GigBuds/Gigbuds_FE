'use client'
import MessagingContainer from '@/components/messaging/MessagingContainer'
import { seedChatHistory } from '@/service/messageCacheService';
import { chatHistoryService } from '@/service/messageCacheService/chatHistoryService'

export default function Messaging() {
  // seedChatHistory().then(() => {
  //   console.log('seeded');
  // });
  const result = chatHistoryService.getChatHistory();
  result.then((result) => {
    console.log(result);
  });
  return (
    <div className="h-full w-full overflow-hidden">
      <MessagingContainer />
    </div>
  )
}