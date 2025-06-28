import messagingSignalRService from "./messagingSignalRService";

export function handleMessagingCallbacks() {
  const connection = messagingSignalRService.HubConnection;
  if (!connection) return;

  connection.on("ReceiveMessage", (data) => {
    console.log("SignalR: Received message", data);
    messagingSignalRService.triggerCallback("onMessageReceived", data);
  });

  connection.on("ReceiveTypingIndicator", (data) => {
    console.log("SignalR: Received typing indicator", data);
    messagingSignalRService.triggerCallback("onTypingIndicatorReceived", data);
  });

  connection.on("ReceiveMessageStatus", (data) => {
    console.log("SignalR: Received message status", data);
    messagingSignalRService.triggerCallback("onMessageStatusReceived", data);
  });

  connection.on("RemovedFromConversation", (data) => {
    console.log("SignalR: Removed from conversation", data);
    messagingSignalRService.triggerCallback("onRemovedFromConversation", data);
  });

  connection.on("JoinedConversationGroup", (data) => {
    console.log("SignalR: Joined conversation group", data);
    messagingSignalRService.triggerCallback("onJoinedConversationGroup", data);
  });
}