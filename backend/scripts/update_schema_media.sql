-- Add media columns to research_content table
ALTER TABLE research_content 
ADD COLUMN IF NOT EXISTS thumbnail_url VARCHAR(500) AFTER category,
ADD COLUMN IF NOT EXISTS video_url VARCHAR(500) AFTER thumbnail_url;
