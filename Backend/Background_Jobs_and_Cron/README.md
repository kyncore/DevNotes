# Background Jobs and Cron Task Management

In backend engineering, not all tasks can be completed within the short time frame of a single API request. Some tasks are long-running, some need to be run at specific times, and some need to be retried upon failure. This is where background jobs and cron tasks come in.

## Part 1: Background Jobs

A background job is a task that is executed outside of the main application flow, typically in a separate process or on a separate machine. This prevents the main application (e.g., your API server) from being blocked and keeps the user experience fast and responsive.

### Why Use Background Jobs?

-   **Long-Running Tasks:** Operations that take more than a few seconds, such as video processing, image resizing, or generating a large report.
-   **Asynchronous Communication:** Sending emails or push notifications. You don't want the user to wait for the email server to respond.
-   **Reliability and Retries:** If a task fails (e.g., a third-party API is down), a background job system can automatically retry it later.
-   **Decoupling Services:** The API can offload work to a dedicated set of "worker" machines, allowing for independent scaling.

### Core Components of a Job Queue System

A typical background job system consists of three main parts:

1.  **The Client:** The part of your application that creates jobs and pushes them onto a queue.
2.  **The Message Broker (Queue):** A dedicated service that stores the jobs. It acts as a buffer between the client and the workers. Popular choices include **Redis** and **RabbitMQ**.
3.  **The Worker:** A separate process that pulls jobs from the queue and executes them.

**Diagram:**
```
+-----------+      1. User uploads video
|           | ---------------------------> +--------------+      2. Create Job('process_video', video_id)
|   User    |                              |              | -------------------------------------------> +---------------+
|           |      3. Return "OK 202"      |  API Server  |                                                |               |
|           | <--------------------------- | (Client)     |                                                | Message Broker|
+-----------+                              |              |      5. Job is delivered to a worker           |    (Redis)    |
                                           +--------------+ <-------------------------------------------    |               |
                                                                    |         (e.g., BullMQ, Celery)         +---------------+
                                                                    |
                                           +--------------+ <-------+
                                           |              |
                                           | Worker Process|      4. Pulls job from queue
                                           | (Processor)   |
                                           +--------------+
```

### Real-World Example: Video Processing Service

Let's design a system where a user uploads a video, and we process it into different resolutions (1080p, 720p, 480p).

**Technology Stack:**
-   **API Server:** Node.js with Express
-   **Message Broker:** Redis
-   **Job Queue Library:** BullMQ (a popular Node.js library)
-   **Worker:** A separate Node.js process

**Step 1: The API Endpoint (Client)**
This endpoint receives the video upload and enqueues the job.
```javascript
// server.js - The API
const { Queue } = require('bullmq');
const videoQueue = new Queue('video-processing', { connection: { host: 'redis' } });

app.post('/upload-video', async (req, res) => {
  // Assume 'saveVideoFile' saves the original video and returns a DB record
  const video = await saveVideoFile(req.files.video);

  // Add a job to the queue. The job has a name and a payload.
  await videoQueue.add('process-video', { videoId: video.id });

  // Immediately respond to the user. DO NOT wait for processing.
  res.status(202).json({ message: "Your video is being processed." });
});
```

**Step 2: The Worker**
This process listens for jobs on the queue and executes them.
```javascript
// worker.js - The background worker
const { Worker } = require('bullmq');

const worker = new Worker('video-processing', async job => {
  const { videoId } = job.data;
  console.log(`Processing video ${videoId}...`);

  // Simulate long-running task
  await processVideoTo1080p(videoId);
  await processVideoTo720p(videoId);
  await processVideoTo480p(videoId);

  // Update the database to mark the video as 'PROCESSED'
  await updateVideoStatus(videoId, 'PROCESSED');

  console.log(`Finished processing video ${videoId}.`);
}, { connection: { host: 'redis' } });

console.log("Worker is listening for jobs...");
```

---

## Part 2: Cron Task Management

A cron task (or cron job) is a task that is scheduled to run automatically at a specified time or interval. Unlike background jobs, which are typically triggered by user actions, cron jobs are time-based.

### Why Use Cron Jobs?

-   **Scheduled Maintenance:** Cleaning up temporary files, rotating logs.
-   **Recurring Reports:** Generating a daily sales report and emailing it to stakeholders.
-   **Data Synchronization:** Syncing data from a third-party API every hour.
-   **Reminders:** Sending a "your cart is expiring" email 24 hours after a user abandons it.

### How it Works

The term "cron" comes from the Unix utility of the same name. A `crontab` file is used to schedule commands. The syntax uses a pattern of five asterisks representing:

```
* * * * *  command_to_execute
│ │ │ │ │
│ │ │ │ └───── Day of the week (0 - 7) (Sunday is 0 or 7)
│ │ │ └─────── Month (1 - 12)
│ │ └───────── Day of the month (1 - 31)
│ └─────────── Hour (0 - 23)
└───────────── Minute (0 - 59)
```

**Examples:**
-   `0 0 * * *` - Run every day at midnight.
-   `*/15 * * * *` - Run every 15 minutes.
-   `0 9 * * 1` - Run every Monday at 9:00 AM.

### Real-World Example: Deleting Old, Unprocessed Videos

Let's say we want to delete videos that were uploaded but failed to process after 7 days.

**Option 1: Using System Cron**
You can use the server's built-in `cron` to run a script.

**1. The Cleanup Script:**
```javascript
// cleanup.js
async function deleteOldVideos() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  // Logic to find and delete videos from DB and storage
  // that are older than 'sevenDaysAgo' and have status 'UPLOAD_FAILED'
  console.log("Running cleanup script...");
  await db.videos.deleteMany({
    where: {
      status: 'UPLOAD_FAILED',
      createdAt: { lt: sevenDaysAgo }
    }
  });
}
deleteOldVideos();
```

**2. The Crontab Entry:**
Open the crontab editor with `crontab -e` and add this line:
```
# Run the cleanup script every day at 3:00 AM
0 3 * * * /usr/bin/node /path/to/your/project/cleanup.js
```

**Option 2: Using a Job Queue Library (Recommended)**
Modern job queue libraries like BullMQ have built-in support for cron-like scheduling. This keeps your application logic self-contained.

```javascript
// scheduler.js - A process that just schedules jobs
const { Queue } = require('bullmq');
const videoQueue = new Queue('video-processing', { connection: { host: 'redis' } });

// Add a repeatable job
async function scheduleCleanup() {
  await videoQueue.add('cleanup-old-videos', {}, {
    repeat: {
      // Cron expression for 3:00 AM every day
      pattern: '0 3 * * *',
    },
    jobId: 'daily-cleanup' // A unique ID to prevent duplicates
  });
}

scheduleCleanup();
```
You would then add a case in your worker to handle this job:
```javascript
// worker.js
const worker = new Worker('video-processing', async job => {
  if (job.name === 'process-video') {
    // ... video processing logic
  } else if (job.name === 'cleanup-old-videos') {
    // ... cleanup logic from the script above
    console.log("Running scheduled cleanup of old videos.");
  }
});
```
This approach is often better because it uses the same worker infrastructure and provides better visibility and retry logic through the job queue's UI.
