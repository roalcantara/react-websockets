import throttle from 'lodash.throttle';
import { useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { Cursor } from './components/Cursor';

const WS_URL = 'ws://127.0.0.1:8000';
const THROTTLE = 50;

const renderCursors = (users) => {
  return Object.entries(users).map(([uuid, user]) => (
    <Cursor key={uuid} point={[user.state.x, user.state.y]} />
  ));
};

const renderUserList = (users) => {
  return (
    <ul>
      {Object.entries(users).map(([uuid, user]) => (
        <li key={uuid}>{JSON.stringify(user)}</li>
      ))}
    </ul>
  );
};

export function Home({ username }) {
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    // asks the server to send the current state the second the component is loaded
    sendJsonMessageThrottled.current({
      x: 0,
      y: 0,
    });
    window.addEventListener('mousemove', (e) => {
      sendJsonMessageThrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, [sendJsonMessageThrottled]);

  if (lastJsonMessage) {
    return (
      <>
        {renderCursors(lastJsonMessage)}
        {renderUserList(lastJsonMessage)}
      </>
    );
  }
  return <h1>Hello, {username}</h1>;
}
