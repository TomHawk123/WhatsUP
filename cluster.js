const cluster = require("cluster");
const os = require("os");
const run = require("./server");

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Respawning...`);
        cluster.fork();
    });
} else {
    run().catch((err) => {
        console.error("Error starting the server:", err);
    });
}
