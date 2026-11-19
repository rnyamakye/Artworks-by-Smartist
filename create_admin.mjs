import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@pencilart.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    app_metadata: { role: 'admin' },
  });
  
  if (error) {
    console.error("Error creating admin user:", error.message);
  } else {
    console.log("Admin user created successfully with role 'admin'!", data.user.id);
  }
}

createAdmin();
