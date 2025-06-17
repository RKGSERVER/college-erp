-- Seed departments data
INSERT INTO departments (id, name, code, description, established_date, status) VALUES
(uuid_generate_v4(), 'Computer Science and Engineering', 'CSE', 'Department of Computer Science and Engineering offering undergraduate and postgraduate programs', '2000-01-01', 'active'),
(uuid_generate_v4(), 'Electronics and Communication Engineering', 'ECE', 'Department of Electronics and Communication Engineering', '2001-01-01', 'active'),
(uuid_generate_v4(), 'Mechanical Engineering', 'MECH', 'Department of Mechanical Engineering', '1999-01-01', 'active'),
(uuid_generate_v4(), 'Civil Engineering', 'CIVIL', 'Department of Civil Engineering', '1998-01-01', 'active'),
(uuid_generate_v4(), 'Electrical Engineering', 'EEE', 'Department of Electrical and Electronics Engineering', '2002-01-01', 'active'),
(uuid_generate_v4(), 'Information Technology', 'IT', 'Department of Information Technology', '2005-01-01', 'active'),
(uuid_generate_v4(), 'Administration', 'ADMIN', 'Administrative Department', '1995-01-01', 'active'),
(uuid_generate_v4(), 'Finance', 'FIN', 'Finance and Accounts Department', '1995-01-01', 'active'),
(uuid_generate_v4(), 'Human Resources', 'HR', 'Human Resources Department', '1996-01-01', 'active'),
(uuid_generate_v4(), 'Library', 'LIB', 'Library and Information Services', '1995-01-01', 'active');
