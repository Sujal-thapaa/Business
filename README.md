# University FAQ Chatbot

A modern chatbot application that answers questions about university-related topics using natural language processing and semantic search. Works completely offline after initial setup, with no paid API required.

## Features

- Real-time question answering using semantic search with embeddings
- Modern React frontend with Tailwind CSS
- Python backend using sentence transformers
- Works completely offline after initial setup
- Uses free, open-source libraries
- Responsive and user-friendly interface
- Easy deployment to cloud platforms

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Lucide icons

### Backend
- Python 3.11
- Sentence Transformers for semantic search
- FAISS for efficient similarity search
- HTTP server for API endpoints

## Getting Started

### Prerequisites
- Python 3.11
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Sujal-thapaa/Business.git
cd Business
```

2. Set up the Python backend:
```bash
python3.11 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
npm install
```

### Running the Application

1. Start the backend server:
```bash
python api.py
```

2. Start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## How It Works

1. The chatbot loads the FAQs from the JSON file
2. It uses the sentence-transformer model to convert questions to vector embeddings
3. When you ask a question, it converts your question to an embedding
4. It uses FAISS to find the most similar question in the database
5. If the similarity is above the threshold, it returns the corresponding answer
6. If no similar question is found, it asks you to rephrase

## Configuration

- Backend port can be configured using the `PORT` environment variable
- Frontend API URL can be configured using `VITE_API_URL` environment variable
- FAQ data is stored in `faqs.json`
- Similarity threshold can be adjusted (default: 0.5)

### Customizing FAQs

Edit the `faqs.json` file to add your own questions and answers. The format is:

```json
[
  {
    "question": "Your question here?",
    "answer": "Your answer here."
  }
]
```

## Performance

- The model is lightweight and runs well on CPU
- Initial load time may take a few seconds as the model is loaded into memory
- Subsequent queries are very fast due to FAISS vector search

## Deployment

The application can be deployed to various cloud platforms. We recommend using Render.com for easy deployment:

1. Push your code to GitHub
2. Connect your GitHub repository to Render
3. Configure the environment variables
4. Deploy both frontend and backend services

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
