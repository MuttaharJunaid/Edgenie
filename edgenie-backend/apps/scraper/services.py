"""
Scraper service — imports from ai/classification module.
All AI logic lives in /ai/classification/classification_model.py
"""
from ai.classification.classification_model import (
    ClassificationPipeline
)

# Re-export for backwards compatibility
ClassificationService = ClassificationPipeline
