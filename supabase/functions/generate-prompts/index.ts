import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { page, category } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const categoryInstruction =
      category === 'summarize'
        ? 'Suggest 3 short prompts a user could click to ask the assistant to summarize something on this page.'
        : category === 'create'
        ? 'Suggest 3 short prompts a user could click to ask the assistant to create something relevant to this page.'
        : 'Suggest 3 short "How do I" questions a user might ask about this page.';

    const system =
      'You generate short, click-ready prompt suggestions for an in-app AI assistant in a HubSpot-style CRM. ' +
      'Return ONLY a JSON object: {"prompts": ["...", "...", "..."]}. ' +
      'Each prompt is one sentence, under 90 characters, no numbering, no quotes inside.';

    const user = `Current page: ${page || 'Unknown'}.\n${categoryInstruction}`;

    const r = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      console.error('AI gateway error:', r.status, t);
      return new Response(JSON.stringify({ error: 'AI gateway error', status: r.status }), {
        status: r.status === 429 || r.status === 402 ? r.status : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await r.json();
    const content = data.choices?.[0]?.message?.content ?? '{}';
    let prompts: string[] = [];
    try {
      const parsed = JSON.parse(content);
      prompts = Array.isArray(parsed.prompts) ? parsed.prompts.slice(0, 3) : [];
    } catch {
      prompts = [];
    }

    return new Response(JSON.stringify({ prompts }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('generate-prompts error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
