import React from "react";
import Notifier from "react-desktop-notification";

class NotificationView extends React.Component {
  ws = new WebSocket(
    "wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self"
  );

  token = "ca6a6fa6-f403-4595-85fc-615d0d73f521";

  componentDidMount() {
    document.title = "Dealer Intervention Tool";

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
    var isOldTitle = true;
    var oldTitle = "Dealer Intervention Tool";
    var newTitle = "--- New Order Awaits Input ---";
    var interval = null;

    function changeFavicon(src) {
      var link = document.createElement("link"),
        oldLink = document.getElementById("dynamic-favicon");
      link.id = "dynamic-favicon";
      link.rel = "shortcut icon";
      link.href = src;
      if (oldLink) {
        document.head.removeChild(oldLink);
      }
      document.head.appendChild(link);
    }

    function changeTitle() {
      document.title = isOldTitle ? oldTitle : newTitle;
      isOldTitle = !isOldTitle;

      changeFavicon(isOldTitle ? "" : "");
    }
    interval = setInterval(changeTitle, 700);

    Notification.requestPermission().then(function () {});

    this.notification = new Notification("Dealer Intervention", {
      body: "Click here",
      icon: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.onlinewebfonts.com%2Fsvg%2Fimg_462343.png&f=1&nofb=1",
      image:
        "https://images.freeimages.com/images/small-previews/88e/money-money-money-1241634.jpg",
      requireInteraction: true,
    });

    this.notification.addEventListener("click", function () {
      window.focus();
      // eslint-disable-next-line no-restricted-globals
      parent.focus();
      document.title = oldTitle;
      clearInterval(interval);
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
          onClick={() => this.displayWindowsNotification()}
        >
          Send Windows Notification locally
        </button>
      </div>
    );
  }
}

export default NotificationView;
