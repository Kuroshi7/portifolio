import type { CorpusDocument } from "../types"

export const CORPUS: CorpusDocument[] = [
  {
    id: "doc-rag-1",
    topic: "tech",
    title: "What is Retrieval-Augmented Generation",
    text: "Retrieval-Augmented Generation (RAG) combines a retriever and a generator. The retriever fetches relevant documents from a vector store. The generator uses those documents as grounding context. RAG reduces hallucination and lets the model use up-to-date knowledge without retraining.",
  },
  {
    id: "doc-rag-2",
    topic: "tech",
    title: "Embeddings basics",
    text: "Embeddings turn text into high-dimensional vectors. Semantically similar phrases land close to each other. Cosine similarity measures the angle between two embedding vectors. Vector stores use ANN indices like HNSW or IVF to search billions of vectors in milliseconds.",
  },
  {
    id: "doc-rag-3",
    topic: "tech",
    title: "Chunking strategies",
    text: "Chunking splits long documents into smaller pieces before embedding. Fixed-size chunks are simple but break sentences. Sentence-aware chunkers preserve grammar. Overlap between chunks improves recall when relevant context sits on a chunk boundary.",
  },
  {
    id: "doc-agents-1",
    topic: "tech",
    title: "Agent loops",
    text: "An agent is an LLM in a loop with tools, memory, and a goal. The loop observes the state, decides the next action, executes the tool, and updates the state. LangGraph models this loop as a state machine with explicit nodes and conditional edges.",
  },
  {
    id: "doc-agents-2",
    topic: "tech",
    title: "Tools and function calling",
    text: "Tools are typed functions the LLM can invoke. The model emits a tool call, the runtime executes it, and the result feeds back into the context. Function calling lets agents query APIs, run code, or read documents reliably.",
  },
  {
    id: "doc-langchain",
    topic: "tech",
    title: "LangChain vs LangGraph",
    text: "LangChain composes LLM calls, prompts, and parsers into linear chains. LangGraph models agent workflows as graphs with state. Graphs handle branching, loops, and human-in-the-loop better than linear chains.",
  },
  {
    id: "doc-music",
    topic: "music",
    title: "Extreme music",
    text: "Extreme metal genres include black metal, death metal, and grindcore. Tremolo picking, blast beats, and harsh vocals are common. Bands like Mayhem, Death, and Napalm Death shaped the sound.",
  },
  {
    id: "doc-food",
    topic: "food",
    title: "Italian pasta",
    text: "Italian pasta comes in hundreds of shapes. Carbonara uses eggs, guanciale, and pecorino, never cream. Cacio e pepe is just pasta water, pecorino, and pepper. Al dente means the pasta still bites back.",
  },
  {
    id: "doc-finance",
    topic: "finance",
    title: "Index investing",
    text: "Index funds track a market index like the S&P 500. They have low fees and broad diversification. Bogle popularized this approach. Most active managers underperform their benchmark over long horizons.",
  },
  {
    id: "doc-travel",
    topic: "travel",
    title: "Travel light",
    text: "Carry-on only travel means one bag for any trip length. Roll clothes, use packing cubes, and stick to one color palette. Avoid checked luggage to skip baggage claim and lost-bag risk.",
  },
]
