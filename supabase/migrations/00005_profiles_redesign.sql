-- ============================================================================
-- PROFILES TABLE REDESIGN
-- Complete user profile schema with robust trigger
-- ============================================================================

-- ============================================================================
-- 1. DROP OLD TABLE AND DEPENDENCIES
-- ============================================================================

-- Drop old trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;

-- Drop old table (CASCADE removes dependent policies)
DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================================================
-- 2. CREATE NEW PROFILES TABLE
-- ============================================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contact info
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Personal info
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    display_name VARCHAR(100),
    avatar_url TEXT,
    date_of_birth DATE,
    
    -- Location
    country VARCHAR(2),        -- ISO 3166-1 alpha-2
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Preferences
    preferred_currency CHAR(3) DEFAULT 'USD',
    
    -- Subscription
    subscription_tier subscription_tier NOT NULL DEFAULT 'FREE',
    subscription_expires_at TIMESTAMPTZ,
    
    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================================
-- 3. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own profile
CREATE POLICY "profiles_delete_own" ON profiles
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 4. TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. ROBUST HANDLE_NEW_USER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_first_name TEXT;
    v_last_name TEXT;
    v_display_name TEXT;
    v_avatar_url TEXT;
    v_full_name TEXT;
    v_name_parts TEXT[];
BEGIN
    -- Extract raw metadata
    v_first_name := NEW.raw_user_meta_data->>'first_name';
    v_last_name := NEW.raw_user_meta_data->>'last_name';
    v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name'
    );
    
    -- If we have full_name but not first/last, try to parse it
    IF (v_first_name IS NULL OR v_first_name = '') AND v_full_name IS NOT NULL AND v_full_name != '' THEN
        v_name_parts := string_to_array(v_full_name, ' ');
        v_first_name := v_name_parts[1];
        IF array_length(v_name_parts, 1) > 1 THEN
            v_last_name := array_to_string(v_name_parts[2:], ' ');
        END IF;
    END IF;
    
    -- Fallback for first_name: use email prefix
    IF v_first_name IS NULL OR v_first_name = '' THEN
        v_first_name := split_part(NEW.email, '@', 1);
    END IF;
    
    -- Generate display_name
    v_display_name := COALESCE(
        NULLIF(TRIM(COALESCE(v_first_name, '') || ' ' || COALESCE(v_last_name, '')), ''),
        v_full_name,
        split_part(NEW.email, '@', 1)
    );
    
    -- Insert profile
    INSERT INTO public.profiles (
        user_id,
        email,
        first_name,
        last_name,
        display_name,
        avatar_url
    ) VALUES (
        NEW.id,
        NEW.email,
        v_first_name,
        v_last_name,
        v_display_name,
        v_avatar_url
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. CREATE TRIGGER ON AUTH.USERS
-- ============================================================================

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. BACKFILL EXISTING USERS
-- ============================================================================

INSERT INTO public.profiles (user_id, email, first_name, display_name, avatar_url)
SELECT 
    id,
    email,
    COALESCE(
        raw_user_meta_data->>'first_name',
        split_part(COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''), ' ', 1),
        split_part(email, '@', 1)
    ),
    COALESCE(
        raw_user_meta_data->>'full_name',
        raw_user_meta_data->>'name',
        split_part(email, '@', 1)
    ),
    raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- 8. COMMENTS
-- ============================================================================

COMMENT ON TABLE profiles IS 'Complete user profiles for both email/password and OAuth users';
COMMENT ON COLUMN profiles.display_name IS 'Auto-generated or custom display name';
COMMENT ON COLUMN profiles.onboarding_completed IS 'Has user completed the onboarding wizard?';
