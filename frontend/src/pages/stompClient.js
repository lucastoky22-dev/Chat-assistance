import { Client, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function connect(onConnect, onError){
    const socket = new SockJS('/ws')
    const client  = new Client({
      webSocketFactory: () => socket,
      debug: console.log,
      onConnect, 
      onError
    })
    stompClient.current = client
    client.activate()
}