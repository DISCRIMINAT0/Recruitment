-- Create enum types
CREATE TYPE user_role AS ENUM ('applicant', 'admin', 'company');
CREATE TYPE cv_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE ad_status AS ENUM ('active', 'paused', 'expired');
CREATE TYPE contact_status AS ENUM ('pending', 'contacted', 'resolved');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'applicant',
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applicant profiles
CREATE TABLE applicant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT,
  location TEXT,
  headline TEXT,
  summary TEXT,
  years_experience INTEGER,
  website_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CVs
CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status cv_status DEFAULT 'draft',
  content JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CV sections (education, experience, skills, etc.)
CREATE TABLE cv_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  content JSONB NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company profiles
CREATE TABLE company_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advertisements
CREATE TABLE advertisements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  status ad_status DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks (applicants bookmarking CVs or companies)
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cv_id UUID REFERENCES cvs(id) ON DELETE CASCADE,
  company_id UUID REFERENCES company_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT bookmark_has_target CHECK (
    (cv_id IS NOT NULL AND company_id IS NULL) OR
    (cv_id IS NULL AND company_id IS NOT NULL)
  )
);

-- Contact requests
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status contact_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_applicant_profiles_user_id ON applicant_profiles(user_id);
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_cvs_status ON cvs(status);
CREATE INDEX idx_cv_sections_cv_id ON cv_sections(cv_id);
CREATE INDEX idx_company_profiles_user_id ON company_profiles(user_id);
CREATE INDEX idx_advertisements_company_id ON advertisements(company_id);
CREATE INDEX idx_advertisements_status ON advertisements(status);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_cv_id ON bookmarks(cv_id);
CREATE INDEX idx_bookmarks_company_id ON bookmarks(company_id);
CREATE INDEX idx_contact_requests_from_user ON contact_requests(from_user_id);
CREATE INDEX idx_contact_requests_to_user ON contact_requests(to_user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applicant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view applicant profiles" ON users
  FOR SELECT USING (role = 'applicant');

-- RLS Policies for applicant_profiles
CREATE POLICY "Applicants can view their own profile" ON applicant_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Applicants can update their own profile" ON applicant_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Applicants can insert their own profile" ON applicant_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view published applicant profiles" ON applicant_profiles
  FOR SELECT USING (true);

-- RLS Policies for CVs
CREATE POLICY "Users can view their own CVs" ON cvs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create CVs" ON cvs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs" ON cvs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs" ON cvs
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public can view published CVs" ON cvs
  FOR SELECT USING (status = 'published');

-- RLS Policies for cv_sections
CREATE POLICY "Users can manage their CV sections" ON cv_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM cvs WHERE cvs.id = cv_sections.cv_id AND cvs.user_id = auth.uid()
    )
  );

-- RLS Policies for company_profiles
CREATE POLICY "Companies can view their own profile" ON company_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Companies can update their own profile" ON company_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Companies can insert their own profile" ON company_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view company profiles" ON company_profiles
  FOR SELECT USING (true);

-- RLS Policies for advertisements
CREATE POLICY "Companies can manage their ads" ON advertisements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles WHERE company_profiles.id = advertisements.company_id AND company_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view active ads" ON advertisements
  FOR SELECT USING (status = 'active' AND start_date <= NOW() AND (end_date IS NULL OR end_date > NOW()));

-- RLS Policies for bookmarks
CREATE POLICY "Users can manage their bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for contact_requests
CREATE POLICY "Users can view their contact requests" ON contact_requests
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create contact requests" ON contact_requests
  FOR INSERT WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their contact requests" ON contact_requests
  FOR UPDATE USING (auth.uid() = to_user_id);
