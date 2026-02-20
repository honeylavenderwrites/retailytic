import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing API key" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Step 1: Get trend predictions (text)
    const textRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "user",
            content: `You are a fashion trend analyst. List exactly 6 western women's summer clothing items (NO accessories, NO shoes, NO bags — only clothing/outfits) that are predicted to trend in the upcoming summer 2025-2026 season.

For each item return a JSON object with:
- "name": short item name (e.g. "Linen Wrap Dress")
- "category": either "Casual" or "Formal"
- "reason": 2-3 sentences explaining WHY this will trend (cite fashion weeks, social media, sustainability movements, etc.)
- "imagePrompt": a detailed prompt to generate a fashion product photo of this item on a mannequin against a white background

Return ONLY a valid JSON array of 6 objects, no markdown, no explanation outside the JSON.`,
          },
        ],
      }),
    });

    const textData = await textRes.json();
    let rawText = textData.choices?.[0]?.message?.content || "[]";
    
    // Clean markdown code fences if present
    rawText = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    const trends = JSON.parse(rawText);

    // Step 2: Generate images for each trend
    const trendsWithImages = await Promise.all(
      trends.map(async (trend: any) => {
        try {
          const imgRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image",
              messages: [
                {
                  role: "user",
                  content: trend.imagePrompt + ". Fashion product photography, clean white background, high quality, no text overlays.",
                },
              ],
              modalities: ["image", "text"],
            }),
          });

          const imgData = await imgRes.json();
          const imageUrl = imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;

          return {
            name: trend.name,
            category: trend.category,
            reason: trend.reason,
            image: imageUrl,
          };
        } catch {
          return {
            name: trend.name,
            category: trend.category,
            reason: trend.reason,
            image: null,
          };
        }
      })
    );

    return new Response(JSON.stringify({ trends: trendsWithImages }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
