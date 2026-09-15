// ═══════════════════════════════════════════════════════
//  中国象棋 - WebSocket 中继服务器
//  部署到 Render 免费版，零配置，任何人都能直接连
// ═══════════════════════════════════════════════════════

const WebSocket = require('ws');
const http = require('http');
const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Chinese Chess Relay Server\n');
});

const wss = new WebSocket.Server({ server });

// 房间: { roomCode: [wsCreator, wsJoiner] }
const rooms = {};

wss.on('connection', (ws) => {
  let room = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      switch (msg.type) {

        case 'create':
          // 创建房间，生成4位码
          let code;
          do { code = String(Math.floor(1000 + Math.random() * 9000)); }
          while (rooms[code]);
          rooms[code] = [ws];
          room = code;
          ws.send(JSON.stringify({ type: 'created', room: code }));
          console.log('[创建] 房间', code);
          break;

        case 'join':
          // 加入房间
          const r = rooms[msg.room];
          if (!r || r.length >= 2) {
            ws.send(JSON.stringify({ type: 'error', message: '房间不存在或已满' }));
            return;
          }
          r.push(ws);
          room = msg.room;
          ws.send(JSON.stringify({ type: 'joined', room: msg.room }));
          // 通知双方准备开始
          broadcast(msg.room, { type: 'start', players: 2 });
          console.log('[加入] 房间', msg.room);
          break;

        case 'move':
          // 转发走棋给对方
          if (room) forward(room, ws, { type: 'move', from: msg.from, to: msg.to });
          break;

        case 'gameover':
          if (room) forward(room, ws, { type: 'gameover', winner: msg.winner });
          break;
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: e.message }));
    }
  });

  ws.on('close', () => {
    if (room && rooms[room]) {
      forward(room, ws, { type: 'opponent_left' });
      delete rooms[room];
      console.log('[关闭] 房间', room);
    }
  });
});

function broadcast(room, msg) {
  if (rooms[room]) {
    const data = JSON.stringify(msg);
    rooms[room].forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(data); });
  }
}

function forward(room, sender, msg) {
  if (!rooms[room]) return;
  const data = JSON.stringify(msg);
  rooms[room].forEach(c => {
    if (c !== sender && c.readyState === WebSocket.OPEN) c.send(data);
  });
}

server.listen(PORT, () => {
  console.log('象棋服务器运行在端口', PORT);
});
