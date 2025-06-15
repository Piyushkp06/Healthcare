
import os
from dotenv import load_dotenv
load_dotenv()
import os
class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # Set your Gemini API key here
    # Google Custom Search API key (get from Google Cloud Console)
    SEARCH_API_KEY = os.getenv("SEARCH_API_KEY")  # Set your Google Custom Search API key here
    # Google Custom Search API endpoint (usually this)
    SEARCH_API_ENDPOINT = "https://www.googleapis.com/customsearch/v1"
    # Your Custom Search Engine ID (get from Google Custom Search Engine dashboard)
    SEARCH_ENGINE_ID = "638372d386d684c81"
    # Maximum number of search results to process
    MAX_SEARCH_RESULTS = 1
    TRUSTED_MEDICAL_DOMAINS = [
        "pubmed.ncbi.nlm.nih.gov",
        "clinicaltrials.gov",
        "who.int",
        "cdc.gov",
        "nih.gov",
        "mayoclinic.org",
        "nhs.uk",
        "indianmedguru.com", # Example: Adding a hypothetical Indian medical domain
        "icmr.nic.in", # Indian Council of Medical Research
        "cdsco.gov.in", # Central Drugs Standard Control Organization (India)
        # Add more highly reputable, evidence-based medical sources relevant to India and globally
    ]

    # NLP Model Paths (Placeholder - you'd need to train/fine-tune these)
    # BioBERT, PubMedBERT, ClinicalBERT are good starting points for medical NLP.
    # For actual usage, you'd download these models or specify their Hugging Face paths.
    NER_MODEL_PATH = "microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract"  # Example: A pre-trained biomedical BERT for NER
    REL_MODEL_PATH = "path/to/your/relation_extraction_model" # This would be a custom trained model
    SUMMARIZER_MODEL_NAME = "t5-small" # A generic summarizer, might need fine-tuning for medical text

    # Knowledge Graph
    KNOWLEDGE_GRAPH_DB_PATH = "knowledge_graph.db" # Using SQLite for simplicity, Neo4j for larger KGs
    MEDICAL_ONTOLOGY_PATH = "data/medical_ontology.json" # Or API endpoint for UMLS, SNOMED CT, etc.

    # Data Limits (for crawling/processing)
    MAX_SEARCH_RESULTS = 10
    MAX_CRAWL_DEPTH = 1 # Keep low for safety and resource management

    # Logging
    LOG_LEVEL = "INFO" # DEBUG, INFO, WARNING, ERROR, CRITICAL