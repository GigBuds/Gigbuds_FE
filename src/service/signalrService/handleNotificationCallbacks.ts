import signalRService from "./signalrService";

export function handleNotificationCallbacks() {
  const connection = signalRService.HubConnection;
  if (!connection) return;

  // Employer notifications
  connection.on("NotifyNewJobApplicationReceived", (data) => {
    console.log("SignalR: New job application received", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyNewFeedbackReceived", (data) => {
    console.log("SignalR: New feedback received", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyNewFollower", (data) => {
    console.log("SignalR: New follower", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyJobPostExpired", (data) => {
    console.log("SignalR: Job post expired", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyMembershipExpired", (data) => {
    console.log("SignalR: Membership expired", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });
}
