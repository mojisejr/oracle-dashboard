const { config } = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const today = new Date().toISOString().split('T')[0];
  
  console.log('Checking weather for:', today, '\n');
  
  const { data, error } = await supabase
    .from('weather_forecasts')
    .select('location_id, forecast_date, tc_max, rain_mm')
    .eq('forecast_date', today)
    .eq('location_id', 'suan-ban')
    .limit(5);
  
  if (error) {
    console.log('❌ Error:', error.message);
    return;
  }
  
  console.log('Today data count:', data?.length || 0);
  
  if (data && data.length > 0) {
    data.forEach(r => {
      console.log(`  ✅ ${r.forecast_date} | ${r.location_id} | ${r.tc_max}°C | ${r.rain_mm}mm`);
    });
  } else {
    console.log('❌ NO DATA FOR TODAY\n');
    
    const { data: latest } = await supabase
      .from('weather_forecasts')
      .select('forecast_date')
      .eq('location_id', 'suan-ban')
      .order('forecast_date', { ascending: false })
      .limit(10);
    
    console.log('\nLatest suan-ban dates:');
    latest?.forEach(r => console.log(`  ${r.forecast_date}`));
  }
}

check().catch(console.error);
