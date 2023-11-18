import throttle from 'lodash.throttle';
import { useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';

const WS_URL = 'ws://127.0.0.1:8000';
const THROTTLE = 50;

export function Home({ username }) {
  const { sendJsonMessage } = useWebSocket(WS_URL, {
    queryParams: { username },
  });

  const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      sendJsonMessageThrottled.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, [sendJsonMessageThrottled]);

  return <h1>Hello, {username}</h1>;
}
