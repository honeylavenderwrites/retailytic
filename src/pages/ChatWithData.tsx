import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Loader2, Bot, User } from "lucide-react";
import { useDataStore } from "@/store/dataStore";
import EmptyDataState from "@/components/EmptyDataState";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-data`;

const SUGGESTED_QUESTIONS = [
  "What is the total revenue and how many orders were placed?",
  "Which are the top 5 best-selling products?",
  "What payment methods are most used?",
  "Who are the VIP customers?",
  "Which product categories generate the most revenue?",
  "What is the average order value?",
  "Are there any at-risk customers I should re-engage?",
  "What are the market basket associations?",
];

export default function ChatWithData() {
  const { dataSource, rawSummary, kpiData, products, customers, paymentMethods, categoryBreakdown, marketBasketRules, rfmSegments, analysisTexts } = useDataStore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (dataSource === 'mock') {
    return (
      <div className="animate-slide-in space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Ask questions about your sales data</p>
          </div>
        </div>
        <EmptyDataState title="No Data Uploaded" description="Upload your sales file first, then ask the AI assistant any question about your data." />
      </div>
    );
  }

  const dataSummary = {
    summary: rawSummary,
    topProducts: products.slice(0, 15).map(p => ({ name: p.productName, code: p.productCode, revenue: p.totalRevenue, qty: p.totalQuantitySold, abc: p.abcClass })),
    topCustomers: customers.slice(0, 15).map(c => ({ name: c.name, spend: c.totalSpend, orders: c.totalOrders, segment: c.segment, churnRisk: c.churnRisk })),
    paymentMethods,
    categoryBreakdown,
    rfmSegments,
    marketBasketRules: marketBasketRules.slice(0, 5),
    analysisTexts,
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          dataSummary,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(errData.error || `Error ${resp.status}`);
      }

      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e.message || "Failed to get response. Please try again."}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-slide-in flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">Ask anything about your uploaded sales data</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto rounded-lg border bg-card p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground">Ask me anything about your data</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              I have access to your sales data, customer analytics, product performance, and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 max-w-lg justify-center">
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-lg px-4 py-3 text-sm ${
              msg.role === "user" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-card-foreground"
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
            {msg.role === "user" && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-lg bg-muted px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
          placeholder="Ask about your sales data..."
          className="flex-1 rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
