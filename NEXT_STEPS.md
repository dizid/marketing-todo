# 🚀 Next Steps - What You Need to Do Right Now

Your app code is **fully ready**. Now you need to configure your Supabase database.

## Quick Summary

You have **3 main tasks**:

1. **Create 3 missing database tables** (5 minutes)
2. **Create 1 PostgreSQL trigger** (2 minutes)
3. **Configure 3 email redirect URLs** (2 minutes)

Then **test** that everything works (5 minutes)

**Total time**: ~15 minutes

---

## Task 1: Create Database Tables (5 min)

Go to: **Supabase Dashboard** → **SQL Editor** → **Create New Query**

Copy & paste this entire SQL block and click **Run**:

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

✅ **You know it worked when**: You see the three new tables in your Supabase **Table Editor**

---

## Task 2: Create Auto-Create Trigger (2 min)

Still in **SQL Editor**, create a new query and paste:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
```

Click **Run**

✅ **You know it worked when**: You see "Query returned successfully with no rows"

---

## Task 3: Configure Email Redirects (2 min)

Go to: **Supabase Dashboard** → **Authentication** → **URL Configuration**

Scroll to **Redirect URLs** section and add:

```
http://localhost:3000/auth
http://localhost:3000/reset-password
http://localhost:3000/
```

Click **Save**

✅ **You know it worked when**: All three URLs appear in the Redirect URLs list

---

## Test It Works (5 min)

Run your app:
```bash
npm run dev
```

### Test 1: Sign Up
1. Go to `http://localhost:3000/auth`
2. Click "Sign up"
3. Enter email and password
4. ✅ Should auto-login and go to dashboard (NOT ask for email confirmation)

### Test 2: Password Reset
1. Go to `/auth`
2. Click "Forgot password?"
3. Enter your email
4. ✅ Should see: "Check your email for a password reset link"
5. Click the reset link from the email
6. ✅ Should go to `/reset-password` page (NOT `/auth`)
7. Enter new password and submit
8. ✅ Should see success message and redirect to login

### Test 3: Data Saves
1. Type something in "App Description"
2. Refresh the page
3. ✅ Text should still be there
4. Sign out and sign back in
5. ✅ Text should still be there

---

## Still Having Issues?

1. **"Invalid email or password" after signup?**
   - Make sure Task 2 (trigger) was created successfully

2. **Reset link goes to `/auth` not `/reset-password`?**
   - Make sure Task 3 (URL Configuration) has both URLs

3. **Data not saving?**
   - Check that Task 1 (tables) created successfully
   - Check browser console for errors
   - Verify you're logged in before saving

4. **Other errors?**
   - Check Supabase **Logs** tab for database errors
   - Check browser **Console** for JavaScript errors

---

## That's It! 🎉

After these 3 tasks work, your app will have:
- ✅ Working email confirmation
- ✅ Working password reset
- ✅ Data that saves to Supabase
- ✅ Data that persists across sessions

For more detailed explanations, see:
- `IMPLEMENTATION_CHECKLIST.md` - Step-by-step guide with explanations
- `SUPABASE_ISSUES_FIXED.md` - Detailed explanation of all issues and fixes
- `COMPLETE_SETUP.md` - Full setup including Grok AI and Netlify
