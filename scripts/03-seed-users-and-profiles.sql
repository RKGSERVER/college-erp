-- Seed sample users and profiles for all roles

-- Get department IDs for reference
DO $$
DECLARE
    cse_dept_id UUID;
    ece_dept_id UUID;
    mech_dept_id UUID;
    admin_dept_id UUID;
    fin_dept_id UUID;
    
    -- User IDs
    admin_user_id UUID := uuid_generate_v4();
    principal_user_id UUID := uuid_generate_v4();
    faculty1_user_id UUID := uuid_generate_v4();
    faculty2_user_id UUID := uuid_generate_v4();
    student1_user_id UUID := uuid_generate_v4();
    student2_user_id UUID := uuid_generate_v4();
    employee1_user_id UUID := uuid_generate_v4();
    employee2_user_id UUID := uuid_generate_v4();
BEGIN
    -- Get department IDs
    SELECT id INTO cse_dept_id FROM departments WHERE code = 'CSE';
    SELECT id INTO ece_dept_id FROM departments WHERE code = 'ECE';
    SELECT id INTO mech_dept_id FROM departments WHERE code = 'MECH';
    SELECT id INTO admin_dept_id FROM departments WHERE code = 'ADMIN';
    SELECT id INTO fin_dept_id FROM departments WHERE code = 'FIN';

    -- Insert Admin User
    INSERT INTO users (id, username, email, password_hash, role, status, email_verified, phone_verified) VALUES
    (admin_user_id, 'admin', 'admin@college.edu', '$2b$10$example_hash', 'admin', 'active', true, true);

    INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, gender, blood_group, nationality, phone, emergency_contact, address, city, state, country, postal_code, department_id) VALUES
    (admin_user_id, 'System', 'Administrator', '1980-01-01', 'other', 'O+', 'Indian', '+91-9876543210', '+91-9876543211', '123 Admin Street', 'Mumbai', 'Maharashtra', 'India', '400001', admin_dept_id);

    -- Insert Principal
    INSERT INTO users (id, username, email, password_hash, role, status, email_verified, phone_verified) VALUES
    (principal_user_id, 'principal', 'principal@college.edu', '$2b$10$example_hash', 'principal', 'active', true, true);

    INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, gender, blood_group, nationality, phone, emergency_contact, address, city, state, country, postal_code, department_id, bio) VALUES
    (principal_user_id, 'Dr. Margaret', 'Thompson', '1965-05-15', 'female', 'A+', 'Indian', '+91-9876543220', '+91-9876543221', '456 Principal Avenue', 'Mumbai', 'Maharashtra', 'India', '400002', admin_dept_id, 'Experienced educator and administrator with 25+ years in higher education');

    -- Insert Faculty Members
    INSERT INTO users (id, username, email, password_hash, role, status, email_verified, phone_verified) VALUES
    (faculty1_user_id, 'sarah.johnson', 'sarah.johnson@college.edu', '$2b$10$example_hash', 'faculty', 'active', true, true),
    (faculty2_user_id, 'michael.brown', 'michael.brown@college.edu', '$2b$10$example_hash', 'faculty', 'active', true, true);

    INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, gender, blood_group, nationality, phone, emergency_contact, address, city, state, country, postal_code, department_id, bio) VALUES
    (faculty1_user_id, 'Dr. Sarah', 'Johnson', '1985-07-10', 'female', 'B+', 'Indian', '+91-9876543230', '+91-9876543231', '789 Faculty Lane', 'Mumbai', 'Maharashtra', 'India', '400003', cse_dept_id, 'Associate Professor specializing in Database Systems and Software Engineering'),
    (faculty2_user_id, 'Prof. Michael', 'Brown', '1978-12-20', 'male', 'AB+', 'Indian', '+91-9876543240', '+91-9876543241', '321 Professor Street', 'Mumbai', 'Maharashtra', 'India', '400004', mech_dept_id, 'Professor of Mechanical Engineering with expertise in Thermodynamics');

    INSERT INTO faculty (user_id, employee_id, designation, qualification, experience_years, specialization, research_interests, join_date, employment_type, office_location) VALUES
    (faculty1_user_id, 'FAC001', 'Associate Professor', 'Ph.D. in Computer Science', 8, 'Database Systems, Software Engineering', 'Database optimization, Software architecture, Machine learning applications', '2018-01-15', 'permanent', 'CSE Block, Room 301'),
    (faculty2_user_id, 'FAC002', 'Professor', 'Ph.D. in Mechanical Engineering', 15, 'Thermodynamics, Heat Transfer', 'Renewable energy systems, Heat exchanger design', '2010-08-01', 'permanent', 'Mech Block, Room 201');

    -- Insert Students
    INSERT INTO users (id, username, email, password_hash, role, status, email_verified, phone_verified) VALUES
    (student1_user_id, 'john.smith', 'john.smith@student.college.edu', '$2b$10$example_hash', 'student', 'active', true, false),
    (student2_user_id, 'emily.davis', 'emily.davis@student.college.edu', '$2b$10$example_hash', 'student', 'active', true, true);

    INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, gender, blood_group, nationality, phone, emergency_contact, address, city, state, country, postal_code, department_id) VALUES
    (student1_user_id, 'John', 'Smith', '2002-03-20', 'male', 'A+', 'Indian', '+91-9876543250', '+91-9876543251', '654 Student Road', 'Mumbai', 'Maharashtra', 'India', '400005', cse_dept_id),
    (student2_user_id, 'Emily', 'Davis', '2001-11-15', 'female', 'O-', 'Indian', '+91-9876543260', '+91-9876543261', '987 Campus Street', 'Mumbai', 'Maharashtra', 'India', '400006', ece_dept_id);

    INSERT INTO students (user_id, student_id, admission_date, current_semester, current_year, program, specialization, cgpa, total_credits, admission_type, hostel_required, transport_required) VALUES
    (student1_user_id, 'STU001', '2022-08-15', 6, 3, 'B.Tech Computer Science', 'Artificial Intelligence', 8.5, 180, 'merit', true, false),
    (student2_user_id, 'STU002', '2022-08-15', 6, 3, 'B.Tech Electronics', 'VLSI Design', 8.2, 180, 'merit', false, true);

    -- Insert Employees
    INSERT INTO users (id, username, email, password_hash, role, status, email_verified, phone_verified) VALUES
    (employee1_user_id, 'mike.wilson', 'mike.wilson@college.edu', '$2b$10$example_hash', 'employee', 'active', true, true),
    (employee2_user_id, 'lisa.anderson', 'lisa.anderson@college.edu', '$2b$10$example_hash', 'employee', 'active', true, true);

    INSERT INTO user_profiles (user_id, first_name, last_name, date_of_birth, gender, blood_group, nationality, phone, emergency_contact, address, city, state, country, postal_code, department_id, bio) VALUES
    (employee1_user_id, 'Mike', 'Wilson', '1988-12-05', 'male', 'AB+', 'Indian', '+91-9876543270', '+91-9876543271', '147 Staff Colony', 'Mumbai', 'Maharashtra', 'India', '400007', admin_dept_id, 'Administrative staff member handling student records and documentation'),
    (employee2_user_id, 'Lisa', 'Anderson', '1990-06-25', 'female', 'B-', 'Indian', '+91-9876543280', '+91-9876543281', '258 Employee Quarters', 'Mumbai', 'Maharashtra', 'India', '400008', fin_dept_id, 'Finance department specialist managing accounts and budgets');

    INSERT INTO employees (user_id, employee_id, designation, job_title, join_date, employment_type, office_location, work_schedule) VALUES
    (employee1_user_id, 'EMP001', 'Administrative Officer', 'Student Records Manager', '2020-03-01', 'permanent', 'Admin Block, Room 105', 'Monday to Friday, 9:00 AM - 5:00 PM'),
    (employee2_user_id, 'EMP002', 'Accounts Officer', 'Finance Specialist', '2019-07-15', 'permanent', 'Finance Block, Room 203', 'Monday to Friday, 9:30 AM - 5:30 PM');

END $$;
