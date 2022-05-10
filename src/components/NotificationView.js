import React from "react";
import Notifier from "react-desktop-notification";

class NotificationView extends React.Component {
  ws = new WebSocket(
    "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
  );

  token = "ca6a6fa6-f403-4595-85fc-615d0d73f521";

  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
    };

    // Subscribe to websocket and filter messages based on token
    this.ws.onmessage = (evt) => {
      // listen to data sent from the websocket server
      try {
        const message = JSON.parse(evt.data);
        if (message?.token === this.token) {
          console.log("the message is", message.payload);
          this.displayNotification(message.payload);

          // eslint-disable-next-line no-restricted-globals
          // parent.focus();
          // window.focus(); //just in case, older browsers
        }
      } catch (error) {}
    };
  }

  sendNotification(notificationType) {
    this.ws.send(
      JSON.stringify({ token: this.token, payload: notificationType })
    );
  }

  displayNotification(notificationType) {
    if (notificationType === 0) {
      this.displayWindowsNotification();
    } else if (notificationType === 1) {
      this.displayReactDesktopNotification();
    } else if (notificationType === 2) {
      window.focus();
      console.log("focus on this window");
      // eslint-disable-next-line no-restricted-globals
      parent.focus();
    }
  }

  notification;

  displayWindowsNotification() {
    Notification.requestPermission().then(function () {});

    this.notification = new Notification("Big Deal", {
      body: "Click here",
      icon: "https://en.wikipedia.org/static/images/project-logos/enwiki.png",
      requireInteraction: true,
    });
    this.notification.addEventListener("click", function () {
      // eslint-disable-next-line no-restricted-globals

      window.open("http://localhost:3000");
    });
  }

  displayReactDesktopNotification() {
    // Notifier.start(
    //   "Title",
    //   "Here is context",
    //   "www.google.com",
    //   "validated image url"
    // );

    Notifier.focus(
      "Title",
      "Here is context",
      "www.google.com",
      "validated image url"
    );
  }

  render() {
    return (
      <div className="App">
        <button
          className="sendNotification"
          onClick={() => this.sendNotification(0)}
        >
          Windows Notification via Websockets
        </button>
        <button
          className="sendNotification"
          onClick={() => this.sendNotification(1)}
        >
          Windows Notification via react-desktop-notification
        </button>
        <button
          className="sendNotification"
          onClick={() => this.sendNotification(2)}
        >
          Using window.focus() via websockets
        </button>
        <button
          className="sendNotification"
          onClick={() => this.displayWindowsNotification()}
        >
          Send Windows Notification locally
        </button>
      </div>
    );
  }
}

export default NotificationView;
