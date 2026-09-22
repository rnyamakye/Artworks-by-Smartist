import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'http://127.0.0.1:54331',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU' 
);

async function addTutorial() {
  const { error } = await supabase.from('tutorials').insert({
    title: '',
    youtube_id: 'Jtn50t4NQlQ',
    description: ''
  });
  console.log(error ? error : "Tutorial added!");
}

addTutorial();
