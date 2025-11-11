# PHASE 1: Database Setup - READY TO EXECUTE

**Status**: ✅ Complete (Planning & Files Created)
**Files Created**:
- `PHASE_1_DATABASE_MIGRATION.sql` - SQL migration script
- `PHASE_1_SETUP_GUIDE.md` - Step-by-step execution guide
- `PHASE_1_SUMMARY.md` - This file

**Time to Execute**: ~1 hour
**Next Phase**: Phase 2 (Remove notes fields)

---

## What You Need to Do

### Option A: Quick Path (15 minutes)
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy-paste the entire script from `PHASE_1_DATABASE_MIGRATION.sql`
4. Click Run
5. Verify the 3 tables appear in Table Editor
6. Done!

### Option B: Safe Path (1 hour) - RECOMMENDED
Follow the detailed step-by-step guide in `PHASE_1_SETUP_GUIDE.md`:
1. Create backup first
2. Optionally delete test users
3. Run migration SQL
4. Verify each table structure
5. Check RLS policies
6. Test locally with dev server
7. Verify subscription auto-created
8. Run sanity checks

---

## What Gets Created

### 1. `subscriptions` Table
Tracks user tier and PayPal subscription details

**Key Fields:**
- `user_id` (unique) - Links to auth.users
- `tier` - 'free' or 'premium' (default: 'free')
- `status` - 'active', 'cancelled', 'expired' (default: 'active')
- `paypal_subscription_id` - PayPal subscription ID (for upgrades)
- `current_period_end` - When quota resets
- Auto-indexed for performance

**Row Level Security:**
- Users can only view their own subscription
- Service role can manage all

### 2. `ai_usage` Table
Tracks every AI generation for quota enforcement

**Key Fields:**
- `user_id` - Links to auth.users
- `task_id` - Which task was used
- `model` - 'grok-2' or 'grok-4-fast'
- `tokens_input` / `tokens_output` - For cost tracking
- `created_at` - When generation happened
- Multi-indexed for fast quota queries

**Row Level Security:**
- Users can only view their own usage
- Service role can insert

### 3. `payments` Table
Audit trail for all payments and transactions

**Key Fields:**
- `user_id` - Links to auth.users
- `amount` / `currency` - Payment amount
- `status` - 'pending', 'completed', 'failed', 'refunded'
- `provider_payment_id` - PayPal transaction ID
- `payment_type` - 'subscription', 'one_time', 'ai_generation'
- `metadata` - JSONB for flexible data storage

**Row Level Security:**
- Users can only view their own payments
- Service role can manage

---

## Key Features

✅ **Row Level Security (RLS)** enabled on all tables
- Users can only see their own data
- Service role (backend) can see/manage everything
- Prevents data leaks between users

✅ **Automatic Initialization**
- When migration runs, all existing auth users get a `subscriptions` row
- Tier: 'free' (default)
- Status: 'active' (default)

✅ **Performance Optimized**
- Indexes on frequently-queried columns (user_id, created_at, status)
- Efficient for quota calculations
- Fast lookups for subscription status

✅ **Production Ready**
- Proper data types (UUID, timestamp, decimal)
- Constraints and validation
- Foreign key relationships
- Metadata field for future extensibility

✅ **Easy to Rollback**
- CLEANUP section included in SQL script
- Can drop all tables and revert if needed
- Backup created first for safety

---

## Timeline

| Task | Time |
|------|------|
| Backup database | 5 min |
| Delete test users (optional) | 10 min |
| Run migration SQL | 5 min |
| Verify tables in UI | 5 min |
| Check RLS policies | 5 min |
| Test locally | 15 min |
| Sanity checks | 5 min |
| **TOTAL** | **~1 hour** |

---

## Success Criteria

After Phase 1, you should have:

- [ ] 3 new tables visible in Supabase Table Editor
- [ ] All columns present and correct data types
- [ ] RLS policies active (🔒 lock icon visible)
- [ ] At least one subscription row (from test user or initial auth)
- [ ] Local dev server starts without errors
- [ ] New test user signup auto-creates subscription row
- [ ] No console errors
- [ ] All verification queries return expected results

---

## Next Steps After Phase 1

Once Phase 1 is verified:

1. **Commit to git:**
   ```bash
   git add PHASE_1_*
   git commit -m "docs: add Phase 1 database migration scripts and guide"
   ```

2. **Start Phase 2:** Remove notes fields
   - Takes ~2-3 hours
   - Can run in parallel if you prefer

3. **Start Phase 3:** Create subscription store
   - Takes ~3-4 hours
   - Depends on Phase 1 (database) being complete

---

## Files Reference

| File | Purpose | Size |
|------|---------|------|
| `PHASE_1_DATABASE_MIGRATION.sql` | Complete SQL migration script | ~300 lines |
| `PHASE_1_SETUP_GUIDE.md` | Step-by-step execution guide | ~200 lines |
| `PHASE_1_SUMMARY.md` | This summary document | ~150 lines |

All files are in `/home/marc/DEV/sales/` directory

---

## Troubleshooting

**Most Common Issues:**

1. **"Table already exists"**
   - Run CLEANUP section first to drop old tables
   - Then re-run full migration

2. **"RLS policies failed"**
   - Go to Settings → Database → Enable Row Level Security
   - Re-run migration

3. **"Connection refused"**
   - Check Supabase project is running (not paused)
   - Verify `.env` has correct credentials

4. **"Auth users not found"**
   - This is expected if you deleted all test users
   - Subscription rows will be created when new users sign up

Full troubleshooting in `PHASE_1_SETUP_GUIDE.md`

---

## Important Notes

⚠️ **Backup First**
- Always create backup before running migrations
- Takes only 5 minutes
- Can restore if anything goes wrong

⚠️ **Test Users**
- You can optionally delete test users before running migration
- Script will create subscriptions for remaining users
- Fresh start recommended

⚠️ **RLS is Critical**
- Don't skip RLS setup
- Prevents users from seeing other users' data
- Must be enabled before paying users sign up

✅ **Data Safety**
- Migration is additive (only creates new tables)
- Existing data (projects, project_data) untouched
- Rollback option available

---

## Questions?

Before executing Phase 1, confirm you have:

- [ ] Read `PHASE_1_SETUP_GUIDE.md`
- [ ] Understand the 3 tables being created
- [ ] Know how to access Supabase dashboard
- [ ] Have backup procedure ready
- [ ] Ready to test locally after migration

---

**Ready to execute Phase 1? Let me know and I can guide you through the step-by-step process!**

**Or if you have questions, ask them now before we proceed.**

---

*Created: 2025-11-11*
*Part of: Total Make-Over Improvement Plan - Freemium Model Setup*
