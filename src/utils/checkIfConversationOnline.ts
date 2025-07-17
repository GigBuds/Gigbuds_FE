import { ConversationMember } from "@/types/messaging.types";
import { OnlineUser } from "@/lib/redux/features/messagingMetadataSlice";

export const checkIfTargetOnline = (members: ConversationMember[], onlineUsers: OnlineUser[]): boolean => {
  for (const member of members) {
    const index = onlineUsers.findIndex(x => x.userId === member.userId);
    if (index !== -1) {
      return onlineUsers[index].lastActive === -1; // -1 means the user is online
    }
  }
  return false;
}

