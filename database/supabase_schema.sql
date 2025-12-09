-- ============================================
-- YACHT BOOKING PLATFORM - SUPABASE SCHEMA
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- No RLS (Row Level Security) policies - direct table access
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'yacht_admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================
-- YACHTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS yachts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(50) NOT NULL CHECK (location IN ('Dubai Marina', 'JBR', 'Creek')),
    yacht_type VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    has_catering BOOLEAN DEFAULT false,
    hourly_price DECIMAL(10, 2) NOT NULL CHECK (hourly_price >= 0),
    daily_price DECIMAL(10, 2) NOT NULL CHECK (daily_price >= 0),
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    included JSONB NOT NULL DEFAULT '[]'::jsonb,
    excluded JSONB NOT NULL DEFAULT '[]'::jsonb,
    terms JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'disabled')),
    yacht_admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for yachts
CREATE INDEX IF NOT EXISTS idx_yachts_status ON yachts(status);
CREATE INDEX IF NOT EXISTS idx_yachts_yacht_admin_id ON yachts(yacht_admin_id);
CREATE INDEX IF NOT EXISTS idx_yachts_location ON yachts(location);
CREATE INDEX IF NOT EXISTS idx_yachts_approved ON yachts(status) WHERE status = 'approved';

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    yacht_id UUID NOT NULL REFERENCES yachts(id) ON DELETE CASCADE,
    yacht_name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50) NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    hours INTEGER NOT NULL CHECK (hours > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    special_request TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_yacht_id ON bookings(yacht_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_yachts_updated_at ON yachts;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_yachts_updated_at BEFORE UPDATE ON yachts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES (Optional - Run to check)
-- ============================================
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('users', 'yachts', 'bookings');

-- ============================================
-- NOTES
-- ============================================
-- 1. No RLS policies - direct table access
-- 2. Password hashing done in API (bcryptjs)
-- 3. All timestamps in UTC
-- 4. JSONB for arrays (images, amenities, etc.)
-- 5. Foreign keys ensure data integrity
-- 6. Indexes for performance

