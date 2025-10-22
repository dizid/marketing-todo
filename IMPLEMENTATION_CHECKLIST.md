# Implementation Checklist - Fix Supabase Issues

This checklist guides you through the remaining setup steps to fix all authentication and database persistence issues.

## ✅ Code Changes - COMPLETE

All necessary code changes have been made:

- ✅ **ResetPassword.vue** - New component for password reset flow
- ✅ **Router updated** - Added `/reset-password` route
- ✅ **App.vue updated** - Email confirmation detection added
- ✅ **supabase.js updated** - resetPassword redirects to `/reset-password`
- ✅ **authStore.js updated** - User session fetched after login
- ✅ **AuthForm.vue updated** - Router redirect on successful login

**Status**: Ready for database and Supabase configuration

---

## 🔧 Your Action Items (4 Steps)

### Step 1: Create Missing Database Tables

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Create a new query and paste this SQL:

```sql
-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  key text NOT NULL,
  value text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_settings_pkey PRIMARY KEY (id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT user_settings_unique UNIQUE(user_id, key)
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own settings"
  ON public.user_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create category_notes table
CREATE TABLE IF NOT EXISTS public.category_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category_id text NOT NULL,
  notes text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT category_notes_pkey PRIMARY KEY (id),
  CONSTRAINT category_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  CONSTRAINT category_notes_unique UNIQUE(user_id, category_id)
);

ALTER TABLE public.category_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own category notes"
  ON public.category_notes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create generated_content table
CREATE TABLE IF NOT EXISTS public.generated_content (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content_type text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT generated_content_pkey PRIMARY KEY (id),
  CONSTRAINT generated_content_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) ON DELETE CASCADE
);

ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own generated content"
  ON public.generated_content
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

4. Click **Run**
5. Verify all three tables appear in your **Table Editor** sidebar

✅ **Task Complete When**: All three new tables appear in your Supabase dashboard

---

### Step 2: Create Auto-Create Trigger for user_profiles

This trigger automatically creates a `user_profiles` record when a user signs up, fixing the "Invalid email or password" issue.

1. In **Supabase Dashboard** → **SQL Editor**
2. Create a new query and paste this SQL:

```sql
-- Create function to auto-create user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
```

3. Click **Run**
4. You should see: "Query returned successfully with no rows"

✅ **Task Complete When**: Trigger is created without errors

---

### Step 3: Configure Supabase Email Redirect URLs

Email confirmation and password reset links redirect users to specific URLs. You must configure these in Supabase.

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**

2. In the **Redirect URLs** section, add these URLs:
   - `http://localhost:3000/auth` (email confirmation)
   - `http://localhost:3000/reset-password` (password reset)
   - `http://localhost:3000/` (general login redirect)

   **Note**: If deploying to production, also add:
   - `https://yourdomain.com/auth`
   - `https://yourdomain.com/reset-password`
   - `https://yourdomain.com/`

3. Click **Save**

✅ **Task Complete When**: All three localhost URLs are saved in URL Configuration

---

### Step 4: Test All Flows

Run your app and test each flow:

```bash
npm run dev
```

#### Test 4a: Email Confirmation Flow
1. Sign up with a new email at `/auth`
2. Check if you're immediately logged in (auto-confirmation enabled)
3. ✅ Should redirect to `/` (dashboard)
4. ✅ Should NOT show "Invalid email or password" error

#### Test 4b: Password Reset Flow
1. Go to `/auth` login page
2. Click "Forgot password?"
3. Enter your email and submit
4. ✅ Should see: "Check your email for a password reset link"
5. Click the reset link in the email
6. ✅ Should land on `/reset-password` (NOT `/auth`)
7. Enter new password and confirm
8. ✅ Should see: "Password reset successfully!"
9. ✅ Should redirect to login page

#### Test 4c: Data Persistence
1. Fill in "App Description" field
2. Add some notes to the checklist
3. Refresh the page
4. ✅ Data should still be there (saved to Supabase)
5. Sign out and sign back in
6. ✅ Data should still be there (persistent across sessions)

✅ **All Tests Pass When**: Email confirmation, password reset, and data persistence work correctly

---

## 📋 Verification Checklist

After completing all 4 steps above, verify:

- [ ] Three new tables created (user_settings, category_notes, generated_content)
- [ ] Trigger function created (handle_new_user)
- [ ] Email redirect URLs configured in Supabase
- [ ] Can sign up and auto-login
- [ ] Can reset password via email link
- [ ] Can see `/reset-password` page after clicking reset link
- [ ] App description persists after refresh
- [ ] Data persists after sign out → sign in

---

## 🔍 Troubleshooting

**Problem**: "Invalid email or password" after email confirmation
- **Solution**: Make sure trigger (Step 2) was created successfully

**Problem**: Reset link goes to `/auth` instead of `/reset-password`
- **Solution**: Check that URL Configuration (Step 3) has both URLs added

**Problem**: Data not saving to database
- **Solution**: Check that new tables (Step 1) were created without errors

**Problem**: Still getting errors?
- Check Supabase **SQL Editor** for trigger creation errors
- Check Supabase **Logs** for RLS policy violations
- Check browser console for JavaScript errors

---

## ✨ What's Now Working

Once you complete all 4 steps:

✅ User signup creates user_profiles automatically
✅ Email confirmation works and auto-logs in users
✅ Password reset email sends correctly
✅ Password reset link goes to proper `/reset-password` page
✅ Can login after email confirmation
✅ Data persists to Supabase (not just localStorage)
✅ Data persists across sessions (sign out → sign in)
✅ Grok AI can save generated content
✅ App description and task progress save to database

---

## 📞 Need Help?

If you encounter issues:

1. **Read SUPABASE_ISSUES_FIXED.md** for detailed explanation of each fix
2. **Check Supabase Dashboard** → **Logs** for database errors
3. **Check browser console** for JavaScript errors
4. **Verify table names** match what code expects: `user_settings`, `category_notes`, `generated_content`

---

## 🚀 Next Steps After This

Once tests pass:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Test Grok AI: `netlify dev` (runs locally with proxy)
3. Deploy to production when ready

For Grok AI setup, see `COMPLETE_SETUP.md` section on Netlify Configuration.
