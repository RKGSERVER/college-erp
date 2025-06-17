-- Seed courses data
DO $$
DECLARE
    cse_dept_id UUID;
    ece_dept_id UUID;
    mech_dept_id UUID;
    civil_dept_id UUID;
    it_dept_id UUID;
BEGIN
    -- Get department IDs
    SELECT id INTO cse_dept_id FROM departments WHERE code = 'CSE';
    SELECT id INTO ece_dept_id FROM departments WHERE code = 'ECE';
    SELECT id INTO mech_dept_id FROM departments WHERE code = 'MECH';
    SELECT id INTO civil_dept_id FROM departments WHERE code = 'CIVIL';
    SELECT id INTO it_dept_id FROM departments WHERE code = 'IT';

    -- Computer Science Courses
    INSERT INTO courses (course_code, course_name, description, credits, semester, year, department_id, course_type, prerequisites) VALUES
    ('CS101', 'Programming Fundamentals', 'Introduction to programming concepts using C/C++', 4, 1, 1, cse_dept_id, 'core', NULL),
    ('CS102', 'Data Structures', 'Linear and non-linear data structures, algorithms', 4, 2, 1, cse_dept_id, 'core', 'CS101'),
    ('CS201', 'Object Oriented Programming', 'OOP concepts using Java', 3, 3, 2, cse_dept_id, 'core', 'CS101'),
    ('CS202', 'Database Management Systems', 'Relational databases, SQL, normalization', 4, 4, 2, cse_dept_id, 'core', 'CS102'),
    ('CS301', 'Software Engineering', 'Software development lifecycle, design patterns', 3, 5, 3, cse_dept_id, 'core', 'CS201'),
    ('CS302', 'Computer Networks', 'Network protocols, OSI model, TCP/IP', 4, 6, 3, cse_dept_id, 'core', 'CS202'),
    ('CS401', 'Machine Learning', 'ML algorithms, neural networks, deep learning', 3, 7, 4, cse_dept_id, 'elective', 'CS301'),
    ('CS402', 'Web Technologies', 'HTML, CSS, JavaScript, frameworks', 3, 8, 4, cse_dept_id, 'elective', 'CS301');

    -- Electronics Courses
    INSERT INTO courses (course_code, course_name, description, credits, semester, year, department_id, course_type, prerequisites) VALUES
    ('EC101', 'Basic Electronics', 'Electronic devices and circuits', 4, 1, 1, ece_dept_id, 'core', NULL),
    ('EC102', 'Digital Electronics', 'Logic gates, combinational circuits', 4, 2, 1, ece_dept_id, 'core', 'EC101'),
    ('EC201', 'Analog Circuits', 'Amplifiers, oscillators, filters', 4, 3, 2, ece_dept_id, 'core', 'EC101'),
    ('EC202', 'Microprocessors', '8085/8086 microprocessor architecture', 4, 4, 2, ece_dept_id, 'core', 'EC102'),
    ('EC301', 'Communication Systems', 'Analog and digital communication', 4, 5, 3, ece_dept_id, 'core', 'EC201'),
    ('EC302', 'VLSI Design', 'CMOS technology, chip design', 3, 6, 3, ece_dept_id, 'elective', 'EC202');

    -- Mechanical Engineering Courses
    INSERT INTO courses (course_code, course_name, description, credits, semester, year, department_id, course_type, prerequisites) VALUES
    ('ME101', 'Engineering Mechanics', 'Statics and dynamics of particles and rigid bodies', 4, 1, 1, mech_dept_id, 'core', NULL),
    ('ME102', 'Engineering Graphics', 'Technical drawing, CAD fundamentals', 3, 2, 1, mech_dept_id, 'core', NULL),
    ('ME201', 'Thermodynamics', 'Laws of thermodynamics, heat engines', 4, 3, 2, mech_dept_id, 'core', 'ME101'),
    ('ME202', 'Fluid Mechanics', 'Properties of fluids, flow analysis', 4, 4, 2, mech_dept_id, 'core', 'ME101'),
    ('ME301', 'Heat Transfer', 'Conduction, convection, radiation', 4, 5, 3, mech_dept_id, 'core', 'ME201'),
    ('ME302', 'Machine Design', 'Design of machine elements', 4, 6, 3, mech_dept_id, 'core', 'ME202');

    -- Civil Engineering Courses
    INSERT INTO courses (course_code, course_name, description, credits, semester, year, department_id, course_type, prerequisites) VALUES
    ('CE101', 'Engineering Mechanics', 'Statics and dynamics for civil engineers', 4, 1, 1, civil_dept_id, 'core', NULL),
    ('CE102', 'Building Materials', 'Properties of construction materials', 3, 2, 1, civil_dept_id, 'core', NULL),
    ('CE201', 'Structural Analysis', 'Analysis of beams, frames, trusses', 4, 3, 2, civil_dept_id, 'core', 'CE101'),
    ('CE202', 'Concrete Technology', 'Mix design, testing of concrete', 3, 4, 2, civil_dept_id, 'core', 'CE102'),
    ('CE301', 'Foundation Engineering', 'Soil mechanics, foundation design', 4, 5, 3, civil_dept_id, 'core', 'CE201'),
    ('CE302', 'Transportation Engineering', 'Highway design, traffic engineering', 3, 6, 3, civil_dept_id, 'elective', 'CE201');

    -- Information Technology Courses
    INSERT INTO courses (course_code, course_name, description, credits, semester, year, department_id, course_type, prerequisites) VALUES
    ('IT101', 'Computer Fundamentals', 'Basic computer concepts and programming', 3, 1, 1, it_dept_id, 'core', NULL),
    ('IT102', 'Web Development', 'HTML, CSS, JavaScript basics', 4, 2, 1, it_dept_id, 'core', 'IT101'),
    ('IT201', 'Database Systems', 'Database design and management', 4, 3, 2, it_dept_id, 'core', 'IT101'),
    ('IT202', 'Network Administration', 'Network setup and management', 3, 4, 2, it_dept_id, 'core', 'IT102'),
    ('IT301', 'System Administration', 'Server management, cloud computing', 4, 5, 3, it_dept_id, 'core', 'IT202'),
    ('IT302', 'Cybersecurity', 'Information security, ethical hacking', 3, 6, 3, it_dept_id, 'elective', 'IT301');

END $$;
