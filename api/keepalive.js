// api/keepalive.js
// Vercel Serverless Function to ping Supabase and prevent 7-day inactivity pause

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ccxholtuuaybwqxkpgie.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeGhvbHR1dWF5YndxeGtwZ2llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3Mzk1MTAsImV4cCI6MjEwNTMxNTUxMH0.i6MPcxgbCjmMgQAoPYSqIjmh61G69wDD9lGowOc_ZRk';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/app_settings?select=setting_key&limit=1`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    const isOk = response.ok;
    const status = response.status;
    const data = isOk ? await response.json().catch(() => null) : null;

    return res.status(200).json({
      success: isOk,
      supabaseStatus: status,
      message: isOk ? 'Supabase project is active and healthy.' : 'Ping sent to Supabase.',
      timestamp: new Date().toISOString(),
      record: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
