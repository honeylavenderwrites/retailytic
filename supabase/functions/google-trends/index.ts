const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const body = await req.json().catch(() => ({}));
    const categories = body.categories || ['Dresses', 'Sneakers', 'Denim', 'Ethnic Wear', 'Accessories'];
    const context = body.context || 'Nepal fashion retail';

    const prompt = `You are a fashion retail trend analyst. Generate realistic Google Trends-style data for the ${context} market.

For each of these product categories: ${categories.join(', ')}

Return a JSON object with this exact structure (no markdown, just raw JSON):
{
  "trendLines": [
    {
      "category": "Category Name",
      "data": [
        {"month": "Jan 2025", "interest": 65},
        {"month": "Feb 2025", "interest": 70},
        ...12 months of data from Jan 2025 to Dec 2025
      ]
    }
  ],
  "risingTrends": [
    {"keyword": "specific product/pattern name", "category": "parent category", "growth": 250, "currentInterest": 85, "recommendation": "one sentence restock advice"},
    ...5 items
  ],
  "decliningTrends": [
    {"keyword": "specific product/pattern name", "category": "parent category", "decline": -40, "currentInterest": 20, "recommendation": "one sentence inventory advice"},
    ...3 items
  ],
  "seasonalInsights": [
    {"season": "Spring", "topProducts": ["product1", "product2"], "peakMonth": "Mar 2025", "advice": "one sentence"},
    {"season": "Summer", "topProducts": ["product1", "product2"], "peakMonth": "Jun 2025", "advice": "one sentence"},
    {"season": "Autumn", "topProducts": ["product1", "product2"], "peakMonth": "Sep 2025", "advice": "one sentence"},
    {"season": "Winter", "topProducts": ["product1", "product2"], "peakMonth": "Dec 2025", "advice": "one sentence"}
  ],
  "restockRecommendations": [
    {"product": "product name", "action": "Increase Stock" | "Reduce Stock" | "Monitor", "urgency": "high" | "medium" | "low", "reason": "brief reason based on trend data"},
    ...6 items
  ]
}

Make the data realistic with seasonal patterns (e.g., ethnic wear peaks around festivals like Dashain/Tihar in Oct-Nov, winter clothing rises Sep-Jan). Interest values should be 0-100.`;

    const aiResponse = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`AI Gateway error [${aiResponse.status}]: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
    const jsonStr = (jsonMatch[1] || content).trim();
    
    const trendData = JSON.parse(jsonStr);

    return new Response(JSON.stringify({ success: true, ...trendData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Google Trends analysis error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
