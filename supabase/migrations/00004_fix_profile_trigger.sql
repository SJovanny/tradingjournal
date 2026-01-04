-- ============================================================================
-- FIX PROFILE TRIGGER & BACKFILL DATA
-- ============================================================================

-- 1. Drop existing trigger to update the function safetly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Redefine the function with better error handling and fallbacks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    username_val text;
    fullname_val text;
    avatar_val text;
BEGIN
    -- Get metadata with fallbacks
    username_val := NEW.raw_user_meta_data->>'username';
    fullname_val := NEW.raw_user_meta_data->>'full_name';
    avatar_val := NEW.raw_user_meta_data->>'avatar_url';
    
    -- Fallback: Generate username from email if missing
    IF username_val IS NULL OR username_val = '' THEN
        username_val := split_part(NEW.email, '@', 1);
    END IF;
    
    -- Fallback: Use name from metadata if full_name is missing
    IF fullname_val IS NULL OR fullname_val = '' THEN
        fullname_val := NEW.raw_user_meta_data->>'name';
    END IF;

    -- Insert into profiles
    INSERT INTO public.profiles (user_id, username, full_name, avatar_url)
    VALUES (
        NEW.id,
        username_val,
        fullname_val,
        avatar_val
    )
    ON CONFLICT (user_id) DO NOTHING; -- Avoid errors if profile already exists
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. BACKFILL: Create profiles for existing users who don't have one
INSERT INTO public.profiles (user_id, username, full_name, avatar_url)
SELECT 
    id,
    COALESCE(
        raw_user_meta_data->>'username', 
        split_part(email, '@', 1)
    ) as username,
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        split_part(email, '@', 1)
    ) as full_name,
    raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;

-- Verification log
DO $$
DECLARE
    count_profiles int;
    count_users int;
BEGIN
    SELECT count(*) INTO count_profiles FROM public.profiles;
    SELECT count(*) INTO count_users FROM auth.users;
    RAISE NOTICE 'Profiles count: %, Users count: %', count_profiles, count_users;
END $$;
