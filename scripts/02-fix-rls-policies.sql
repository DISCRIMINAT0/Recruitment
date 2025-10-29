-- Add INSERT policy for users table to allow service role to create user profiles during signup
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Add INSERT policy for applicant_profiles
CREATE POLICY "Service role can insert applicant profiles" ON applicant_profiles
  FOR INSERT WITH CHECK (true);

-- Add INSERT policy for company_profiles
CREATE POLICY "Service role can insert company profiles" ON company_profiles
  FOR INSERT WITH CHECK (true);
