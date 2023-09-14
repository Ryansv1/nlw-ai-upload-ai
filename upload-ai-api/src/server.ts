import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAiCompilationRoute } from "./routes/generate-ai-compilation";

const app = fastify();

app.register(fastifyCors, {
    origin: "*",
});

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateAiCompilationRoute)

app.listen({
    port: 3000,
}).then(()=>{
    console.log("Server is running on port 3000");
})