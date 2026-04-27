"""
RAG pipeline — now lives in /ai/search/rag_pipeline.py
This file kept for backwards compatibility.
"""
from ai.search.rag_pipeline import get_rag_pipeline, RAGPipeline

get_pipeline = get_rag_pipeline
FAISSSearchPipeline = RAGPipeline
