import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(5000)
export class TransactionGateway {
    @WebSocketServer()
    server: Server;
}