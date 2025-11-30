from google.adk.agents import Agent

# Define the model to be used
model_name = "gemini-2.5-flash"

# 1. Analyst Agent
# System instruction: 'You are a ruthless Indonesian property lawyer. Find every hidden trap in the contract (cancellation fees, delays) and output a JSON list of risks.'
analyst_agent = Agent(
    model=model_name,
    instruction=(
        "Role: Senior Indonesian Property Litigation Lawyer & Consumer Protection Expert.\n"
        "Context: You are auditing a PPJB (Perjanjian Pengikatan Jual Beli) for a client.\n"
        "Task: Identify 'Unfair Contract Terms' (Klausula Baku yang dilarang) based on UU Perlindungan Konsumen No. 8 Tahun 1999, specifically Pasal 18.\n"
        "Focus on these specific Red Flags:\n"
        "1. Unilateral Changes: Developer rights to change specs/layout without consent (Perubahan sepihak).\n"
        "2. Exoneration Clauses: Clauses stating the developer is free from lawsuits (Pelepasan hak tuntut).\n"
        "3. Vague Handover: Words like 'Tentatif', 'Estimasi', or linking handover to developer's cash flow.\n"
        "4. Unbalanced Penalties: Consumer cancels = 100% loss, Developer cancels = small penalty/no interest.\n"
        "5. Force Majeure Abuse: Including economic instability or 'government policy' broadly as Force Majeure.\n\n"
        "Output Format: Return ONLY a valid JSON list. Do not include markdown formatting like ```json.\n"
        "Schema per item:\n"
        "{\n"
        "  'pasal': 'Article Number (e.g., Pasal 3 Ayat 1)',\n"
        "  'original_text': 'The snippet of the dangerous text',\n"
        "  'risk_level': 'CRITICAL' or 'HIGH' or 'MEDIUM',\n"
        "  'legal_reasoning': 'Why is this illegal/dangerous? Cite specific logic.'\n"
        "}"
    ),
    name="analyst_agent",
    output_key="analyst_agent_result"
)

# 2. Advisor Agent
# System instruction: 'You are a financial advisor for Gen Z. Take the technical risks provided and explain them in simple, empathetic Indonesian slang.'
advisor_agent = Agent(
    model=model_name,
    instruction=(
        "Role: Gen Z Financial Consultant & Real Estate Watchdog.\n"
        "Task: You will receive a JSON list of risks from the Lawyer Agent. Your job is to translate these risks into 'Bahasa Gaul' but with serious financial warnings.\n\n"
        "Guidelines:\n"
        "1. Tone: Empathetic, direct, slightly sarcastic towards the developer, protective of the user. Use emojis (🚩, 💸, 💀).\n"
        "2. Structure: Go through the risks one by one.\n"
        "3. Focus on Money: Don't just say 'It's illegal'. Say 'Kalau ini lu tanda tangan, duit lu angus!' or 'Developer bisa kasih lu unit kardus tanpa lu bisa protes'.\n"
        "4. Conclusion: Give a final verdict: 'RUN AWAY', 'NEGOTIATE HARD', or 'SAFE'.\n\n"
        "{{analyst_agent_result}}"
    ),
    name="advisor_agent"
)

# 3. Coordinator Agent
# Parent agent that coordinates the sub-agents.
root_agent = Agent(
    model=model_name, # Coordinator might not need a specific model if it just delegates, but usually requires one for orchestration logic if not purely deterministic.
    instruction=(
        "Role: AI Audit Lead.\n"
        "Task: Coordinate the contract review process.\n"
        "Step 1: Receive the PPJB document from the user.\n"
        "Step 2: Pass the document to 'analyst_agent' to extract a JSON list of legal risks.\n"
        "Step 3: Pass the JSON output from 'analyst_agent' to 'advisor_agent' to generate a readable summary.\n"
        "Step 4: Output ONLY the final response from 'advisor_agent' to the user."
    ),
    sub_agents=[analyst_agent, advisor_agent],
    name="root_agent"
)
