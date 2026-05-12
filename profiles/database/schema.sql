-- Legal Professional Profiles Database Schema

-- Main profiles table
CREATE TABLE IF NOT EXISTS legal_professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Location
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'United States',
    postal_code VARCHAR(20),

    -- Professional Details
    bar_number VARCHAR(50),
    law_firm VARCHAR(255),
    position VARCHAR(100),
    years_experience INTEGER,

    -- Profile
    bio TEXT,
    profile_image_url TEXT,
    profile_url TEXT UNIQUE NOT NULL,

    -- Source
    source VARCHAR(50) NOT NULL, -- 'findlaw', 'justia', etc.
    source_id VARCHAR(255),

    -- Status
    is_active BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Indexes
    CONSTRAINT unique_source_profile UNIQUE(source, source_id)
);

-- Practice areas (many-to-many relationship)
CREATE TABLE IF NOT EXISTS practice_areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    description TEXT
);

CREATE TABLE IF NOT EXISTS professional_practice_areas (
    professional_id UUID REFERENCES legal_professionals(id) ON DELETE CASCADE,
    practice_area_id INTEGER REFERENCES practice_areas(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    PRIMARY KEY (professional_id, practice_area_id)
);

-- Education
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES legal_professionals(id) ON DELETE CASCADE,
    institution VARCHAR(255) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(255),
    graduation_year INTEGER,
    honors TEXT
);

-- Bar Admissions
CREATE TABLE IF NOT EXISTS bar_admissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES legal_professionals(id) ON DELETE CASCADE,
    jurisdiction VARCHAR(100) NOT NULL,
    admission_date DATE,
    bar_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Active'
);

-- Languages
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS professional_languages (
    professional_id UUID REFERENCES legal_professionals(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
    proficiency VARCHAR(50), -- 'Native', 'Fluent', 'Professional', 'Basic'
    PRIMARY KEY (professional_id, language_id)
);

-- Ratings & Reviews
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    professional_id UUID REFERENCES legal_professionals(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    rating_date DATE,
    CONSTRAINT unique_source_rating UNIQUE(professional_id, source)
);

-- Scraping logs
CREATE TABLE IF NOT EXISTS scrape_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(50) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50), -- 'running', 'completed', 'failed'
    profiles_scraped INTEGER DEFAULT 0,
    profiles_added INTEGER DEFAULT 0,
    profiles_updated INTEGER DEFAULT 0,
    profiles_deleted INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    error_log TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_professionals_name ON legal_professionals(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_professionals_location ON legal_professionals(city, state, country);
CREATE INDEX IF NOT EXISTS idx_professionals_source ON legal_professionals(source, source_id);
CREATE INDEX IF NOT EXISTS idx_professionals_active ON legal_professionals(is_active);
CREATE INDEX IF NOT EXISTS idx_professionals_updated ON legal_professionals(updated_at);
CREATE INDEX IF NOT EXISTS idx_practice_areas_name ON practice_areas(name);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_professionals_fulltext ON legal_professionals
    USING gin(to_tsvector('english', full_name || ' ' || COALESCE(bio, '')));

-- Common practice areas (pre-populate)
INSERT INTO practice_areas (name, category) VALUES
    ('Criminal Defense', 'Criminal Law'),
    ('Personal Injury', 'Tort Law'),
    ('Family Law', 'Family Law'),
    ('Divorce', 'Family Law'),
    ('Child Custody', 'Family Law'),
    ('Estate Planning', 'Estate Law'),
    ('Probate', 'Estate Law'),
    ('Real Estate', 'Property Law'),
    ('Business Law', 'Corporate Law'),
    ('Contract Law', 'Commercial Law'),
    ('Employment Law', 'Labor Law'),
    ('Immigration', 'Immigration Law'),
    ('Bankruptcy', 'Bankruptcy Law'),
    ('Tax Law', 'Tax Law'),
    ('Intellectual Property', 'IP Law'),
    ('Medical Malpractice', 'Tort Law'),
    ('Workers Compensation', 'Labor Law'),
    ('DUI/DWI', 'Criminal Law'),
    ('Civil Rights', 'Constitutional Law'),
    ('Appeals', 'Appellate Law'),
    ('Class Action', 'Litigation'),
    ('Securities Law', 'Corporate Law'),
    ('Mergers & Acquisitions', 'Corporate Law'),
    ('Environmental Law', 'Regulatory Law'),
    ('International Law', 'International Law'),
    ('Litigation', 'Litigation'),
    ('Mediation', 'Alternative Dispute Resolution'),
    ('Arbitration', 'Alternative Dispute Resolution')
ON CONFLICT (name) DO NOTHING;

-- Common languages
INSERT INTO languages (code, name) VALUES
    ('en', 'English'),
    ('es', 'Spanish'),
    ('fr', 'French'),
    ('de', 'German'),
    ('zh', 'Chinese'),
    ('ja', 'Japanese'),
    ('ar', 'Arabic'),
    ('pt', 'Portuguese'),
    ('ru', 'Russian'),
    ('it', 'Italian')
ON CONFLICT (code) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_legal_professionals_updated_at
    BEFORE UPDATE ON legal_professionals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE OR REPLACE VIEW active_professionals_with_practice_areas AS
SELECT
    lp.*,
    STRING_AGG(pa.name, ', ') as practice_areas
FROM legal_professionals lp
LEFT JOIN professional_practice_areas ppa ON lp.id = ppa.professional_id
LEFT JOIN practice_areas pa ON ppa.practice_area_id = pa.id
WHERE lp.is_active = true
GROUP BY lp.id;

-- View for search with ratings
CREATE OR REPLACE VIEW professionals_with_ratings AS
SELECT
    lp.*,
    AVG(r.rating) as avg_rating,
    SUM(r.review_count) as total_reviews
FROM legal_professionals lp
LEFT JOIN ratings r ON lp.id = r.professional_id
WHERE lp.is_active = true
GROUP BY lp.id;
