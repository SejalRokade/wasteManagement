-- Database: wastemanagement

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  role ENUM('citizen','supervisor','admin') DEFAULT 'citizen',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  area VARCHAR(200),
  description TEXT,
  s3_image_key VARCHAR(512),
  status ENUM('open','in_progress','resolved') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS bins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area VARCHAR(200),
  bin_type VARCHAR(50),
  last_emptied TIMESTAMP NULL,
  current_level_percent INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  area VARCHAR(200),
  day_of_week VARCHAR(20),
  time_window VARCHAR(50)
);

-- Ratings (citizen cleanliness ratings)
CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  area VARCHAR(200) NOT NULL,
  rating TINYINT NOT NULL, -- 1-5
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Collection logs (optional completion tracking)
CREATE TABLE IF NOT EXISTS collection_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id INT,
  completed_at TIMESTAMP NULL,
  status ENUM('pending','completed','skipped') DEFAULT 'pending',
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_complaints_user ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status_created ON complaints(status, created_at);
CREATE INDEX IF NOT EXISTS idx_bins_area ON bins(area);
CREATE INDEX IF NOT EXISTS idx_schedules_area_day ON schedules(area, day_of_week);
CREATE INDEX IF NOT EXISTS idx_ratings_area_created ON ratings(area, created_at);
CREATE INDEX IF NOT EXISTS idx_collection_logs_schedule ON collection_logs(schedule_id);


