import json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
import os
import time

class FAQBot:
    def __init__(self, faq_file="faqs.json", model_name="distilbert-base-nli-mean-tokens", similarity_threshold=0.5):
        """
        Initialize the FAQ chatbot.
        
        Args:
            faq_file (str): Path to the JSON file containing FAQs
            model_name (str): Name of the sentence-transformer model to use
            similarity_threshold (float): Threshold for determining when a question is too dissimilar
        """
        self.similarity_threshold = similarity_threshold
        self.model_name = model_name
        self.faq_file = faq_file
        
        # Load FAQs and initialize the embedding model and search index
        self.load_faqs()
        self.init_model()
        self.build_index()
        
    def load_faqs(self):
        """Load the FAQ data from the JSON file."""
        try:
            with open(self.faq_file, 'r', encoding='utf-8') as f:
                self.faqs = json.load(f)
            
            # Extract questions and answers
            self.questions = [item["question"] for item in self.faqs]
            self.answers = [item["answer"] for item in self.faqs]
            
            print(f"Loaded {len(self.questions)} FAQs from {self.faq_file}")
        except FileNotFoundError:
            print(f"Error: FAQ file '{self.faq_file}' not found.")
            exit(1)
        except json.JSONDecodeError:
            print(f"Error: Invalid JSON format in '{self.faq_file}'.")
            exit(1)
    
    def init_model(self):
        """Initialize the sentence transformer model."""
        print(f"Loading the {self.model_name} model... (this may take a moment)")
        start_time = time.time()
        try:
            self.model = SentenceTransformer(self.model_name)
            print(f"Model loaded in {time.time() - start_time:.2f} seconds")
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Make sure you've installed the required packages:")
            print("pip install sentence-transformers faiss-cpu numpy")
            exit(1)
    
    def build_index(self):
        """Build the FAISS index for fast similarity search."""
        # Generate embeddings for all questions
        self.embeddings = self.model.encode(self.questions)
        
        # Normalize the vectors (for cosine similarity)
        faiss.normalize_L2(self.embeddings)
        
        # Get the embedding dimension
        self.dimension = self.embeddings.shape[1]
        
        # Create the FAISS index (using IndexFlatIP for inner product/cosine similarity)
        self.index = faiss.IndexFlatIP(self.dimension)
        
        # Add the question embeddings to the index
        self.index.add(self.embeddings)
        
        print(f"Built search index with {len(self.questions)} questions")
    
    def find_similar_question(self, query):
        """
        Find the most similar question to the user's query.
        
        Args:
            query (str): The user's question
            
        Returns:
            tuple: (answer, distance, index)
        """
        # Convert the query to an embedding
        query_embedding = self.model.encode([query])
        
        # Normalize the query embedding
        faiss.normalize_L2(query_embedding)
        
        # Search the index for the most similar question
        distances, indices = self.index.search(query_embedding, 1)
        
        # Extract the results
        distance = distances[0][0]
        idx = indices[0][0]
        
        # Convert distance to similarity score (cosine similarity is in [-1, 1])
        # Higher is better, 1 is perfect match
        similarity = float(distance)
        
        # Return the answer, similarity score, and index
        return self.answers[idx], similarity, idx
    
    def run(self, debug=False):
        """
        Run the chatbot in a loop, processing user questions until exit.
        
        Args:
            debug (bool): Whether to display debug information like similarity scores
        """
        print("\n==== FAQ Chatbot ====")
        print("Ask me any question! Type 'exit', 'quit', or 'q' to end the conversation.")
        print("This chatbot works 100% locally and doesn't require internet after setup.\n")
        
        while True:
            # Get user input
            user_query = input("\nYou: ").strip()
            
            # Check for exit command
            if user_query.lower() in ['exit', 'quit', 'q']:
                print("\nGoodbye! Thanks for chatting.")
                break
            
            # Skip empty queries
            if not user_query:
                continue
            
            # Find the most similar question and its answer
            answer, similarity, idx = self.find_similar_question(user_query)
            
            # Debug information
            if debug:
                print(f"[DEBUG] Matched: '{self.questions[idx]}'")
                print(f"[DEBUG] Similarity score: {similarity:.4f}")
            
            # Respond based on the similarity score
            if similarity < self.similarity_threshold:
                print("\nBot: I'm not sure. Can you rephrase your question?")
            else:
                print(f"\nBot: {answer}")

def main():
    """Main function to run the FAQ chatbot."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Run a local FAQ chatbot with vector search.")
    parser.add_argument("--faq", type=str, default="faqs.json", help="Path to the FAQ JSON file")
    parser.add_argument("--model", type=str, default="distilbert-base-nli-mean-tokens", help="Name of the sentence-transformer model")
    parser.add_argument("--threshold", type=float, default=0.5, help="Similarity threshold (0.0-1.0)")
    parser.add_argument("--debug", action="store_true", help="Show debug information")
    
    args = parser.parse_args()
    
    # Create and run the chatbot
    bot = FAQBot(
        faq_file=args.faq,
        model_name=args.model,
        similarity_threshold=args.threshold
    )
    bot.run(debug=args.debug)

if __name__ == "__main__":
    main()