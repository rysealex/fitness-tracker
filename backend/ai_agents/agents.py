from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from .graph_state import AgentState
import os
import random # For db placeholder

load_dotenv() # Load the environment variables

# Intialize the LLM (GPT-3.5-turbo for testing, will switch to GPT-4 for product)
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.1)

# NODE 1 - Log Retriever Agent (RAG)
def retrieve_user_logs(state: AgentState) -> AgentState:
    """Retrieves relevant user data (RAG) based on the user query"""
    print("\nNODE 1 (RAG) - Retrieving data from database!")

    query = state["user_query"].lower() # User query in lowercase

    # Placeholder for actual MySQL database call (replace later with actual DB model call)
    if "performance drop" in query or "running" in query:
        logs = [
            "Workout Log: Last week - 3 runs, avg 6.0 mph. This week - 1 run, avg 5.2 mph.",
            "Sleep Log: Last week - avg 7.5 hours. This week - avg 5.5 hours.",
            "Meal Log: Last 3 days skipped breakfast."
        ]
    elif "calorie" in query or "weight" in query:
        logs = [
            "Weight Log: Start: 180 lbs. Current: 182 lbs.",
            "Calorie Target: 2000 kcal/day. Avg Consumption: 2300 kcal/day."
        ]
    else:
        logs = ["No specific data found. Please ask a more focused question."]
    
    # Update the retrieved logs GraphState with the Agent response
    state["retrieved_logs"] = logs 
    return state

# NODE 2 - Analysis Agent (GPT-4)
def analyze_data(state: AgentState) -> AgentState:
    """Uses GPT-4 to analyze the retrieved logs and create an analysis report """
    print("\nNODE 2 - Analysis Agent (GPT-4) - Analyzing data!")

    # Analysis prompt the system to enforce neutral, factual reporting
    analysis_prompt = (
        "You are a highly specialized, neutral Fitness Data Analyst. "
        "Your only task is to analyze the 'User Logs' provided and identify only factual correlations and metrics. "
        "DO NOT give advice or subjective opinions. Generate a concise, objective report strictly based on the logs."
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", analysis_prompt),
        ("human", f"User Query: {state['user_query']}\n\nUser Logs for Analysis: {state['retrieved_logs']}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({})
    
    # Update the analysis report GraphState with the Agent response
    state["analysis_report"] = response.content 
    return state

# NODE 3 - Advice Generator Agent (GPT-4) & Guardrail Agent (GPT-4)
def generate_advice_and_guardrail(state: AgentState) -> AgentState:
    """Generates user-friendly advice and enforces saftey guardrails"""
    print("\nNODE 3 - Advice Generator Agent (GPT-4) & Guardrail Agent (GPT-4) - Creating safe advice")

    # Guardrail prompt the system to ensure safety and focus on product-level advice
    guardrail_prompt = (
        "You are the final Product Manager AI. Your goal is to translate the following 'Analysis Report' into "
        "encouraging, product-focused, and safe advice for the user. "
        "STRICT RULE: You must NOT give medical advice. Always suggest visiting the app's internal resources or adjusting existing goals."
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", guardrail_prompt),
        ("human", f"User Query: {state['user_query']}\n\nAnalysis Report: {state['analysis_report']}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({})
    
    # Update the final response GraphState with the Agent's responses
    state["final_response"] = response.content
    return state

# NODE 4 - Safety/Refusal Agent
def safety_check_refusal(state: AgentState) -> AgentState:
    """Handles medical or unsafe user queries with a refusal message"""
    print("\nNODE 4 - Safety/Refusal Agent - For unsafe queries, refuses to give advice")

    # Refusal message to display for unsafe user queries
    refusal_message = (
        "I cannot provide advice related to pain, medical conditions, or specific health treatments. "
        "Please consult a certified medical professional for these issues. I can, however, help analyze your logged fitness data."
    )
    
    # Update final response and analysis report GraphStates with the Agent response
    state["final_response"] = refusal_message
    state["analysis_report"] = "N/A - Query Refused"
    return state