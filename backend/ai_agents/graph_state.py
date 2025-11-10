from typing import TypedDict, List
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    """The state for the fitness tracker advice workflow"""
    user_query: str # Intial user query
    retrieved_logs: List[str] # RAG content - data from the db
    analysis_report: str # Analysis report from the Analysis Agent (GPT-4)
    final_respone: str # Final guarded advice
    next_node: str # To help the workflow for routing decisions
    is_safe: bool # Flag to ensure the query is not medical/unsafe