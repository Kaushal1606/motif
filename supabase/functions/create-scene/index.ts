import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const N8N_WEBHOOK_URL = "https://n8n.srv1011999.hstgr.cloud/webhook/create-scene";

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
    const { avatar_name, scene_name, action, location, mood_atmosphere, camera_shot, visual_style } = body;

    // Validate required fields
    if (!avatar_name || !scene_name || !action || !location || !mood_atmosphere || !camera_shot || !visual_style) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate field lengths
    if (scene_name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Scene name must be less than 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Action description must be less than 2000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (location.length > 500) {
      return new Response(
        JSON.stringify({ error: 'Location must be less than 500 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate allowed values
    const allowedStyles = ['Realistic', 'Anime', 'Studio Ghibli', 'Cyberpunk', 'Watercolor'];
    const allowedMoods = ['Calm & Peaceful', 'Tense & Suspenseful', 'Joyful & Uplifting', 'Dark & Dramatic', 'Mysterious & Ethereal', 'Adventurous & Exciting'];
    const allowedShots = ['Close-up', 'Medium Shot', 'Wide Shot', 'Over-the-shoulder', 'Low Angle', 'High Angle', 'Tracking Shot'];

    if (!allowedStyles.includes(visual_style)) {
      return new Response(
        JSON.stringify({ error: 'Invalid visual style' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!allowedMoods.includes(mood_atmosphere)) {
      return new Response(
        JSON.stringify({ error: 'Invalid mood/atmosphere' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!allowedShots.includes(camera_shot)) {
      return new Response(
        JSON.stringify({ error: 'Invalid camera shot' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create payload with verified email
    const payload = {
      avatar_name: avatar_name.trim(),
      scene_name: scene_name.trim(),
      action: action.trim(),
      location: location.trim(),
      mood_atmosphere,
      camera_shot,
      visual_style,
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
        JSON.stringify({ error: 'Failed to create scene' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-scene function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
