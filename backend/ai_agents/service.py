from .graph_state import AgentState
from .workflow_builder import build_advice_workflow

# Build the Fitness Tracker Advice Workflow when application starts
LANGGRAPH_APP = build_advice_workflow()

# Function to start running the Fitness Tracker Advice Workflow
def run(user_query: str) -> dict:
    """
    Initializes the state and invokes the Fitness Tracker Advice Workflow.
    Returns the final output for the API response.
    """

    # Initialize the state with the user's query
    initial_state = AgentState(
        user_query=user_query,
        retrieved_logs=[],
        analysis_report="",
        final_respone="",
        next_node="router", # Entry point for workflow - Query Router
        is_safe=True # Set to true initially
    )

    # Invoke the compiled LangGraph application
    final_state = LANGGRAPH_APP.invoke(initial_state)

    # Return the relevant fields for the Flask response
    return {
        "final_response": final_state["final_response"],
        "analysis_report": final_state["analysis_report"],
        "retrieved_logs": final_state["retrieved_logs"]
    }