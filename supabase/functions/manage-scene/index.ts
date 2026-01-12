import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APPROVE_SCENE_URL = (sceneId: string) => 
  `https://n8n.srv1011999.hstgr.cloud/webhook/97fc9ef9-051b-4d4b-88a4-fe56a82f2f2a/approve-scene/${sceneId}`;
const REJECT_SCENE_URL = (sceneId: string) => 
  `https://n8n.srv1011999.hstgr.cloud/webhook/727b2d9e-e4cd-4c41-944a-ea78619f6282/reject-scene/${sceneId}`;

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
    const { scene_id, action } = body;

    // Validate required fields
    if (!scene_id || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: scene_id and action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate action
    if (!['approve', 'reject'].includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action. Must be "approve" or "reject"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the user owns this scene
    const { data: scene, error: sceneError } = await supabase
      .from('scenes')
      .select('id, user_email, status')
      .eq('id', scene_id)
      .single();

    if (sceneError || !scene) {
      console.error('Scene fetch error:', sceneError);
      return new Response(
        JSON.stringify({ error: 'Scene not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check ownership
    if (scene.user_email !== userEmail) {
      return new Response(
        JSON.stringify({ error: 'You do not have permission to manage this scene' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if scene is in pending status
    if (scene.status !== 'pending_approval') {
      return new Response(
        JSON.stringify({ error: 'Scene is not pending approval' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine webhook URL based on action
    const webhookUrl = action === 'approve' 
      ? APPROVE_SCENE_URL(scene_id) 
      : REJECT_SCENE_URL(scene_id);

    console.log(`${action} scene ${scene_id} for user ${userEmail}`);

    // Forward to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('N8N webhook error:', errorText);
      return new Response(
        JSON.stringify({ error: `Failed to ${action} scene` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in manage-scene function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
