// ═══════════════════════════════════════════════════════════
//  中国象棋 - WebSocket 中继 (Cloudflare Workers 版)
//  免费部署，无需绑卡，国内手机号可注册
// ═══════════════════════════════════════════════════════════

// Cloudflare Worker 脚本 - 部署后所有人可直接连，无需 Token
export default {
  async fetch(request) {
    // WebSocket 升级
    if (request.headers.get('Upgrade') === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair());
      server.accept();

      let room = null;

      server.addEventListener('message', (event) => {
        try {
          const msg = JSON.parse(event.data);

          switch (msg.type) {
            case 'create':
              // 生成4位房间码
              let code;
              do { code = String(Math.floor(1000 + Math.random() * 9000)); }
              while (rooms.has(code));
              rooms.set(code, [server]);
              room = code;
              server.send(JSON.stringify({ type: 'created', room: code }));
              break;

            case 'join':
              const r = rooms.get(msg.room);
              if (!r || r.length >= 2) {
                server.send(JSON.stringify({ type: 'error', message: '房间不存在或已满' }));
                return;
              }
              r.push(server);
              room = msg.room;
              server.send(JSON.stringify({ type: 'joined', room: msg.room }));
              // 通知双方
              broadcast(msg.room, { type: 'start', players: 2 });
              break;

            case 'move':
              if (room) forward(room, server, { type: 'move', from: msg.from, to: msg.to });
              break;

            case 'gameover':
              if (room) forward(room, server, { type: 'gameover', winner: msg.winner });
              break;
          }
        } catch (e) {
          server.send(JSON.stringify({ type: 'error', message: e.message }));
        }
      });

      server.addEventListener('close', () => {
        if (room && rooms.has(room)) {
          forward(room, server, { type: 'opponent_left' });
          rooms.delete(room);
        }
      });

      return new Response(null, { status: 101, webSocket: client });
    }

    // 普通 HTTP 请求
    return new Response('中国象棋中继服务器', { headers: { 'Content-Type': 'text/plain' } });
  }
};

// 内存存储（Cloudflare Workers 全局变量）
const rooms = new Map();

function broadcast(room, msg) {
  const data = JSON.stringify(msg);
  const clients = rooms.get(room);
  if (clients) clients.forEach(c => c.send(data));
}

function forward(room, sender, msg) {
  const clients = rooms.get(room);
  if (!clients) return;
  const data = JSON.stringify(msg);
  clients.forEach(c => { if (c !== sender) c.send(data); });
}
