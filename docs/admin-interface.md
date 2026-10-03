# INDOM admin interface
Entry: /admin/ar/login or /admin/en/login. Authentication is live through Supabase Auth; the account requires server-controlled indom_admin app metadata. Credentials are supplied privately and are never stored in this repository.

The dashboard is a UI prototype, as requested. Products can be added and edited in the current page only. CRM entries and visit journeys are illustrative samples. Inquiry replies are local drafts; no messages are sent. Forms are previews, settings are read-only and visitor tracking is not enabled. Reloading resets prototype content.

Checks: npm run build; python scripts/verify-admin.py BASE_URL EXTERNAL_PRIVATE_CREDENTIALS_JSON. The external JSON contains email and password. Do not commit it. Tests print outcomes only.

Existing project advisory review found public execution grants on the pre-existing rls_auto_enable event-trigger function and disabled leaked-password protection. No database tables or access grants were added by this work. These existing settings were left unchanged. References: [function permissions](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [authenticated function permissions](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable), [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
