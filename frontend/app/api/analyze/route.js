import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        // console.log("Received request:", request);
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Default to localhost:8000 if not set, matching the docs
        const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";

        // 1. Setup Agent and Session
        // Reverting to "agents" as this was the configuration that worked previously.
        const appName = "agents";
        const userId = `user_${Date.now()}`;
        const sessionId = `session_${Date.now()}`;

        const headers = {
            "Content-Type": "application/json",
        };

        // Explicitly create the session first as requested
        // POST /apps/{appName}/users/{userId}/sessions/{sessionId}
        try {
            console.log("Creating session...");
            console.log("Backend URL:", `${backendUrl}/apps/${appName}/users/${userId}/sessions/${sessionId}`);
            const createSessionRes = await fetch(`${backendUrl}/apps/${appName}/users/${userId}/sessions/${sessionId}`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({}) // Empty state or initial state if needed
            });
            console.log("Session creation response:", createSessionRes);

            if (!createSessionRes.ok) {
                console.warn(`Failed to create session explicitly: ${createSessionRes.status}. Proceeding to run anyway as it might be optional or handled by run.`);
            }
        } catch (sessionErr) {

            console.warn("Session creation request failed:", sessionErr);
        }

        // 2. Process File to Base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString("base64");
        const mimeType = file.type;
        const fileName = file.name;

        console.log("masuk sini");
        // 3. Call Agent
        // User requested specific prompts for a multi-agent flow. 
        // We send the initial instruction to the coordinator.
        const runPayload = {
            appName: appName,
            userId: userId,
            sessionId: sessionId,
            newMessage: {
                role: "user",
                parts: [
                    { text: "Analisis kontrak ini. Koordinasikan dengan analyst_agent dan advisor_agent untuk memberikan hasil akhir berupa saran finansial dan hukum yang tegas dalam Bahasa Gaul. Format output menggunakan Markdown agar rapi (gunakan bullet points, bold untuk penekanan)." },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data,
                            displayName: fileName
                        }
                    }
                ]
            }
        };

        const runRes = await fetch(`${backendUrl}/run`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(runPayload)
        });

        if (!runRes.ok) {
            const errText = await runRes.text();
            throw new Error(`Agent run failed: ${runRes.status} - ${errText}`);
        }

        const events = await runRes.json();

        // 4. Parse Response
        // Find the last text part from the model
        let finalResponseText = "";

        for (const event of events) {
            const messageContent = event.content || event.message;
            if (messageContent && messageContent.role === 'model' && messageContent.parts) {
                for (const part of messageContent.parts) {
                    if (part.text) {
                        finalResponseText += part.text;
                    }
                }
            }
        }

        if (!finalResponseText) {
            console.warn("No text found in agent response events:", JSON.stringify(events));
            return NextResponse.json({ error: "Agent returned no text response" }, { status: 500 });
        }

        // Try to parse JSON from the text
        const jsonMatch = finalResponseText.match(/```json\n([\s\S]*?)\n```/) || finalResponseText.match(/\{[\s\S]*\}/);
        let jsonResult;

        if (jsonMatch) {
            try {
                const jsonStr = jsonMatch[1] || jsonMatch[0];
                jsonResult = JSON.parse(jsonStr);
            } catch (e) {
                console.warn("Failed to parse JSON from agent response:", e);
                // Fallback: Treat the entire text as the advice/result
                jsonResult = {
                    summary: "Hasil Analisis Lengkap",
                    risks: [], // Empty risks will hide the risks grid
                    advice: finalResponseText
                };
            }
        } else {
            // No JSON found, treat as plain text response (which is expected now)
            jsonResult = {
                summary: "Hasil Analisis Lengkap",
                risks: [],
                advice: finalResponseText
            };
        }

        return NextResponse.json(jsonResult);

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
