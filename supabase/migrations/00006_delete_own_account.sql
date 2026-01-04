-- ============================================================================
-- ALLOW USERS TO DELETE THEIR OWN ACCOUNT
-- ============================================================================

-- This function allows authenticated users to delete their own account
-- It must be created with SECURITY DEFINER to have access to auth.users

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void AS $$
BEGIN
    -- Delete the user from auth.users
    -- This will cascade to profiles and all other related data
    DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

-- Comment
COMMENT ON FUNCTION public.delete_own_account() IS 'Allows authenticated users to delete their own account';
