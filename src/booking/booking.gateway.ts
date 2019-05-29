import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection
} from '@nestjs/websockets';
import {  Server } from 'socket.io';

@WebSocketGateway(5000)
export class BookingGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: Server;

    handleConnection(client: any) {
        console.log(`connected from ${client.conn.remoteAddress}`);
    }

}
