import signalRService from "./signalrService";

export function handleNotificationCallbacks() {
  const connection = signalRService.HubConnection;
  if (!connection) return;

  // Employer notifications
  connection.on("NotifyNewJobApplicationReceived", (data) => {
    // TODO: Handle new job application notification
    console.log("SignalR: New job application received", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyNewFeedbackReceived", (data) => {
    // TODO: Handle new feedback notification
    console.log("SignalR: New feedback received", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyNewFollower", (data) => {
    // TODO: Handle new follower notification
    console.log("SignalR: New follower", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyJobPostExpired", (data) => {
    // TODO: Handle job post expired notification
    console.log("SignalR: Job post expired", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });

  connection.on("NotifyMembershipExpired", (data) => {
    // TODO: Handle membership expired notification
    console.log("SignalR: Membership expired", data);
    signalRService.triggerCallback("onNotificationReceived", data);
  });
}
