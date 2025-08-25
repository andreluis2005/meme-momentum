const { Server } = require("socket.io");
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "https://your-domain.com"],
    methods: ["GET", "POST"]
  }
});

// Store recent quiz results for analytics
let recentResults = [];
const MAX_STORED_RESULTS = 1000;

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Send recent results to new connections
  socket.emit("recentResults", recentResults);
  
  socket.on("quizResult", (data) => {
    console.log("Quiz result received:", data);
    
    // Store the result
    const resultData = {
      ...data,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    recentResults.push(resultData);
    
    // Keep only the most recent results
    if (recentResults.length > MAX_STORED_RESULTS) {
      recentResults = recentResults.slice(-MAX_STORED_RESULTS);
    }
    
    // Broadcast to all connected clients
    io.emit("quizResult", resultData);
    io.emit("newResult", resultData);
  });
  
  socket.on("requestStats", () => {
    // Calculate basic stats
    const stats = {
      totalResults: recentResults.length,
      recentCount: recentResults.filter(r => 
        new Date(r.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      popularMemecoin: getMostPopularMemecoin(),
      timestamp: new Date().toISOString()
    };
    
    socket.emit("stats", stats);
  });
  
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

function getMostPopularMemecoin() {
  if (recentResults.length === 0) return null;
  
  const counts = {};
  recentResults.forEach(result => {
    const memecoin = result.memecoin_match;
    counts[memecoin] = (counts[memecoin] || 0) + 1;
  });
  
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
}

const PORT = process.env.WEBSOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Accepting connections from allowed origins`);
});

module.exports = { io, recentResults };
