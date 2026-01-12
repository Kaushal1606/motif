import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const N8N_WEBHOOK_URL = "https://n8n.srv1011999.hstgr.cloud/webhook/create-avatar";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      console.error('Auth error:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get verified email from JWT claims
    const userEmail = claimsData.claims.email as string;
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: 'Email not found in token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { avatar_name, user_description, visual_style, gender, age_range } = body;

    // Validate required fields
    if (!avatar_name || !user_description || !visual_style || !gender || !age_range) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate field lengths
    if (avatar_name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Avatar name must be less than 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (user_description.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Description must be less than 2000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate allowed values
    const allowedStyles = ['Realistic', 'Anime', 'Studio Ghibli', 'Cyberpunk', 'Watercolor'];
    const allowedGenders = ['Male', 'Female', 'Non-binary', 'Other'];
    const allowedAges = ['Child (5-12)', 'Teen (13-17)', 'Young Adult (18-25)', 'Adult (26-40)', 'Middle Age (41-60)', 'Senior (60+)'];

    if (!allowedStyles.includes(visual_style)) {
      return new Response(
        JSON.stringify({ error: 'Invalid visual style' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!allowedGenders.includes(gender)) {
      return new Response(
        JSON.stringify({ error: 'Invalid gender' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!allowedAges.includes(age_range)) {
      return new Response(
        JSON.stringify({ error: 'Invalid age range' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create payload with verified email
    const payload = {
      avatar_name: avatar_name.trim(),
      user_description: user_description.trim(),
      visual_style,
      gender,
      age_range,
      user_email: userEmail, // Use verified email from JWT
    };

    console.log('Forwarding to n8n webhook:', { ...payload, user_email: '[REDACTED]' });

    // Forward to n8n webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('N8N webhook error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create avatar' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-avatar function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
