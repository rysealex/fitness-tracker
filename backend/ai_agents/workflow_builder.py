from langgraph.graph import StateGraph, END
from .graph_state import AgentState
from .agents import retrieve_user_logs, analyze_data, generate_advice_and_guardrail, safety_check_refusal

# Query Router Function
def decide_safety_route(state: AgentState) -> AgentState:
    """Determines if the user query is safe or should redirect to the Guardrail Agent"""
    
    query = state["user_query"].lower() # User query in lowercase

    # Keyword-based safety check (Use LLM for production)
    unsafe_keywords = ["pain", "symptom", "diagnosis", "medical", "doctor", "medicine"]

    for keyword in unsafe_keywords:
        if keyword in query:
            return "unsafe" # Go to Safety/Refusal Agent
            
    return "safe" # Go to Log Retriever Agent

# Builder Function
def build_advice_workflow():
    """Builds and compiles the multi-agent Fitness Tracker Advice Workflow"""

    workflow = StateGraph(AgentState)

    # Add all the Agent Nodes
    workflow.add_node("safety_check_refusal", safety_check_refusal)
    workflow.add_node("retrieve_user_logs", retrieve_user_logs)
    workflow.add_node("analyze_data", analyze_data)
    workflow.add_node("generate_advice_and_guardrail", generate_advice_and_guardrail)

    # Set the entry point to the Query Router Function
    workflow.set_entry_point("router")

    # Define the conditional edges (logic behind the decisions between nodes)
    workflow.add_conditional_edges(
        "router",
        decide_safety_route, # The function that determines which agent to utilize
        {
            "unsafe": "safety_check_refusal", # If Unsafe, then go to Safety/Refusal Agent
            "safe": "retrieve_user_logs" # If Safe, then go to Log Retriever Agent
        }
    )

    # Define the sequential edges (path if user query is safe)
    workflow.add_edge("retrieve_user_logs", "analyze_data") # Log Retriever Agent -> Anaylsis Agent
    workflow.add_edge("analyze_data", "generate_advice_and_guardrail") # Analysis Agent -> Advice Generator Agent & Guardrail Agent

    # Define the exit points
    workflow.add_edge("generate_advice_and_guardrail", END) # Advice Generator Agent & Guardrail Agent -> END
    workflow.add_edge("safety_check_refusal", END) # Safety/Refusal Agent -> END

    return workflow.compile()