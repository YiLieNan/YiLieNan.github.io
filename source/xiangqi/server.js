// ═══════════════════════════════════════════════════════
//  中国象棋 - WebSocket 中继服务器
//  部署到 Render / Railway / Fly.io 等免费平台
// ═══════════════════════════════════════════════════════

const WebSocket = require('ws');
const http = require('http');

const PORT = process.env.PORT || 8080;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Chinese Chess Relay Server\n');
});

const wss = new WebSocket.Server({ server });

// 房间管理: { roomCode: [ws1, ws2] }
const rooms = {};

wss.on('connection', (ws) => {
  let currentRoom = null;
  let isCreator = false;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      const { type, room } = msg;

      switch (type) {

        case 'create':
          // 创建房间
          if (rooms[room]) {
            ws.send(JSON.stringify({ type: 'error', message: '房间已被占用' }));
            return;
          }
          rooms[room] = [ws];
          currentRoom = room;
          isCreator = true;
          ws.send(JSON.stringify({ type: 'created', room }));
          console.log(`[创建] 房间 ${room}`);
          break;

        case 'join':
          // 加入房间
          if (!rooms[room] || rooms[room].length < 1) {
            ws.send(JSON.stringify({ type: 'error', message: '房间不存在' }));
            return;
          }
          if (rooms[room].length >= 2) {
            ws.send(JSON.stringify({ type: 'error', message: '房间已满' }));
            return;
          }
          rooms[room].push(ws);
          currentRoom = room;
          isCreator = false;
          ws.send(JSON.stringify({ type: 'joined', room }));
          // 通知双方可以开始
          broadcast(room, { type: 'ready', players: 2 });
          console.log(`[加入] 房间 ${room}`);
          break;

        case 'move':
          // 转发走棋
          if (currentRoom && rooms[currentRoom]) {
            const other = rooms[currentRoom].find(c => c !== ws);
            if (other && other.readyState === WebSocket.OPEN) {
              other.send(JSON.stringify({ type: 'move', from: msg.from, to: msg.to }));
            }
          }
          break;

        case 'gameover':
          // 转发胜负
          if (currentRoom && rooms[currentRoom]) {
            const other = rooms[currentRoom].find(c => c !== ws);
            if (other && other.readyState === WebSocket.OPEN) {
              other.send(JSON.stringify({ type: 'gameover', winner: msg.winner }));
            }
          }
          break;
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: e.message }));
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms[currentRoom]) {
      // 通知对方
      const other = rooms[currentRoom].find(c => c !== ws);
      if (other && other.readyState === WebSocket.OPEN) {
        other.send(JSON.stringify({ type: 'opponent_left' }));
      }
      delete rooms[currentRoom];
      console.log(`[关闭] 房间 ${currentRoom}`);
    }
  });

  ws.on('error', () => {});
});

function broadcast(room, msg) {
  if (rooms[room]) {
    const data = JSON.stringify(msg);
    rooms[room].forEach(c => {
      if (c.readyState === WebSocket.OPEN) c.send(data);
    });
  }
}

server.listen(PORT, () => {
  console.log(`象棋服务器运行在端口 ${PORT}`);
});
