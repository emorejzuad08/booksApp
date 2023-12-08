CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  img_url text,
  title VARCHAR(250),
  read_date date,
  rating integer,
  notes VARCHAR(250),
  author VARCHAR(100),
  first_publish_year VARCHAR(10)
);