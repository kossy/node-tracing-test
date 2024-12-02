import express, { Request, Response } from 'express';


const app = express();
const PORT = 3000;

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
    res.json({ status: 'ok' });

    await fetch('http://0.0.0.0:8080/health');
});

// Example.com fetch endpoint
app.get('/http', async (req: Request, res: Response) => {
    try {
        const response = await fetch('http://0.0.0.0:8080/http-test');
        const data = await response.text();
        res.send(data);
        console.log(response.headers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch from http-test endpoint' });
    }
});

app.get('/llm', async (req: Request, res: Response) => {
    const data = await fetch('http://0.0.0.0:8080/conversation/3434/llm-history-taking@1.0.0', {
        method: "POST",
        headers: {
            "X-Tenant-Id": "bob",
            "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ utterance: "Hello" }),
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});