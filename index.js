const cluster = require("cluster");
const os = require("os");
const redis = require("redis");
const WebSocket = require("ws");
const run = require("./server");

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;

    // Fork worker processes based on the number of CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for dying workers and respawn them
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Respawning...`);
        cluster.fork();
    });
} else {
    run().then((httpServer) => {
        // Create a Redis client
        const redisClient = redis.createClient({
            // Redis configuration (if needed)
        });

        // Handle Redis connection errors
        redisClient.on("error", (err) => {
            console.error(`Redis error: ${err}`);
        });

        // Create WebSocket server and bind it to the HTTP server
        const wss = new WebSocket.Server({ server: httpServer });

        // WebSocket connection handling
        wss.on("connection", (ws) => {
            console.log("WebSocket connection established");

            ws.on("message", (message) => {
                console.log(`Received WebSocket message: ${message}`);
                // Process message and, if needed, use Redis for communication between workers
            });

            ws.on("close", () => {
                console.log("WebSocket connection closed");
            });
        });

        // Listen for incoming HTTP requests
        httpServer.listen(process.env.PORT || 8080, () => {
            console.log(`Listening on port ${process.env.PORT || 8080} `);
            // log the pid and whether it's primary or not
            console.log(`Worker ${process.pid} ${cluster.isPrimary ? "(primary)" : ""} is running`);
        });
    });
}
