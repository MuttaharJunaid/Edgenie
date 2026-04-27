"""
Singleton DistilBERT model loader.
Extracted from scraper/services.py _load_model().

Loads the fine-tuned DistilBERT model once per process.
GPU if available, CPU fallback.
"""
import os
import json
import logging

logger = logging.getLogger('edgenie.ai.classification')

_model_instance = None
_tokenizer_instance = None
_id2label_instance = None
_device_instance = None
_model_loaded = False


def get_model():
    """
    Get or load the DistilBERT classification model.
    Returns: (model, tokenizer, id2label, device)
    Returns (None, None, None, None) if unavailable.
    """
    global _model_instance, _tokenizer_instance
    global _id2label_instance, _device_instance, _model_loaded

    if _model_loaded:
        return (
            _model_instance, _tokenizer_instance,
            _id2label_instance, _device_instance
        )

    model_dir = os.environ.get(
        'CLASSIFICATION_MODEL_DIR',
        '/app/classification_model/output4'
    )

    if not os.path.exists(model_dir):
        logger.warning(
            f'Classification model not found: {model_dir}. '
            f'Set CLASSIFICATION_MODEL_DIR env var.'
        )
        return None, None, None, None

    try:
        import torch
        from transformers import (
            AutoTokenizer,
            AutoModelForSequenceClassification
        )

        logger.info(f'Loading DistilBERT from {model_dir}...')
        tokenizer = AutoTokenizer.from_pretrained(model_dir)

        use_gpu = torch.cuda.is_available()
        dtype = torch.float16 if use_gpu else torch.float32
        device = torch.device('cuda:0' if use_gpu else 'cpu')

        model = AutoModelForSequenceClassification.from_pretrained(
            model_dir, torch_dtype=dtype
        )
        model.to(device)
        model.eval()

        label_path = os.path.join(model_dir, 'label_map.json')
        if os.path.exists(label_path):
            with open(label_path) as f:
                id2label = {
                    int(k): v
                    for k, v in json.load(f)['id2label'].items()
                }
        else:
            id2label = model.config.id2label

        _model_instance = model
        _tokenizer_instance = tokenizer
        _id2label_instance = id2label
        _device_instance = device
        _model_loaded = True

        logger.info(
            f'DistilBERT loaded on {device}. '
            f'Labels: {len(id2label)}'
        )
        return model, tokenizer, id2label, device

    except Exception as e:
        logger.error(f'Model load failed: {e}')
        return None, None, None, None


def is_model_available() -> bool:
    """Check if model is loaded without triggering load."""
    return _model_loaded
