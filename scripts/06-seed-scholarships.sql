-- Seed scholarships data
DO $$
DECLARE
    cse_dept_id UUID;
    ece_dept_id UUID;
    mech_dept_id UUID;
BEGIN
    -- Get department IDs
    SELECT id INTO cse_dept_id FROM departments WHERE code = 'CSE';
    SELECT id INTO ece_dept_id FROM departments WHERE code = 'ECE';
    SELECT id INTO mech_dept_id FROM departments WHERE code = 'MECH';

    -- Insert various scholarship programs
    INSERT INTO scholarships (name, description, scholarship_type, amount, percentage, eligibility_criteria, application_deadline, academic_year, max_recipients, department_id) VALUES
    
    -- Merit-based scholarships
    ('Academic Excellence Scholarship', 'For students with outstanding academic performance', 'merit', 50000.00, NULL, 'CGPA >= 9.0, No backlogs', '2024-06-30', '2024-25', 10, NULL),
    ('Dean''s List Scholarship', 'For students in top 5% of their class', 'merit', 30000.00, NULL, 'Top 5% in class, CGPA >= 8.5', '2024-06-30', '2024-25', 25, NULL),
    ('Department Topper Award', 'For department rank holders', 'merit', NULL, 75.0, 'Department rank 1-3', '2024-06-30', '2024-25', 3, cse_dept_id),
    ('Research Excellence Grant', 'For students involved in research projects', 'merit', 25000.00, NULL, 'Published research paper, Faculty recommendation', '2024-07-15', '2024-25', 15, NULL),
    
    -- Need-based scholarships
    ('Financial Aid Scholarship', 'For economically disadvantaged students', 'need_based', NULL, 50.0, 'Family income < 2 LPA, Good academic standing', '2024-05-31', '2024-25', 50, NULL),
    ('Emergency Financial Support', 'For students facing financial crisis', 'need_based', 20000.00, NULL, 'Documented financial emergency, Faculty recommendation', '2024-12-31', '2024-25', 20, NULL),
    ('Single Parent Support', 'For students from single parent families', 'need_based', NULL, 40.0, 'Single parent family, Income < 3 LPA', '2024-06-15', '2024-25', 30, NULL),
    
    -- Sports scholarships
    ('Sports Excellence Scholarship', 'For outstanding sports achievements', 'sports', 40000.00, NULL, 'State/National level sports achievement', '2024-07-31', '2024-25', 15, NULL),
    ('Inter-College Sports Award', 'For college sports team members', 'sports', 15000.00, NULL, 'College team member, Regular participation', '2024-08-15', '2024-25', 25, NULL),
    
    -- Cultural scholarships
    ('Cultural Excellence Award', 'For achievements in arts and culture', 'cultural', 20000.00, NULL, 'State/National level cultural achievement', '2024-07-31', '2024-25', 10, NULL),
    ('Music and Dance Scholarship', 'For talented musicians and dancers', 'cultural', 15000.00, NULL, 'Demonstrated talent, Regular participation in college events', '2024-08-31', '2024-25', 12, NULL),
    
    -- Minority scholarships
    ('Minority Community Scholarship', 'For students from minority communities', 'minority', NULL, 30.0, 'Minority community certificate, Good academic record', '2024-06-30', '2024-25', 40, NULL),
    ('SC/ST Scholarship', 'Government scholarship for SC/ST students', 'government', NULL, 100.0, 'Valid SC/ST certificate, Family income criteria', '2024-05-31', '2024-25', 100, NULL),
    ('OBC Scholarship', 'Government scholarship for OBC students', 'government', NULL, 50.0, 'Valid OBC certificate, Family income < 8 LPA', '2024-05-31', '2024-25', 80, NULL),
    
    -- Department-specific scholarships
    ('CSE Innovation Award', 'For innovative projects in computer science', 'merit', 35000.00, NULL, 'Innovative project, Technical presentation', '2024-09-30', '2024-25', 8, cse_dept_id),
    ('ECE Research Grant', 'For electronics research projects', 'merit', 30000.00, NULL, 'Research project in electronics, Faculty guidance', '2024-09-30', '2024-25', 6, ece_dept_id),
    ('Mechanical Design Award', 'For outstanding mechanical design projects', 'merit', 25000.00, NULL, 'Design project, Prototype development', '2024-09-30', '2024-25', 5, mech_dept_id),
    
    -- Special scholarships
    ('First Generation Graduate', 'For first-generation college students', 'need_based', NULL, 60.0, 'First in family to attend college, Good academic standing', '2024-06-30', '2024-25', 35, NULL),
    ('Rural Area Scholarship', 'For students from rural backgrounds', 'need_based', 25000.00, NULL, 'Rural area residence certificate, Good academic record', '2024-06-30', '2024-25', 45, NULL),
    ('Girl Child Education Support', 'To promote female education', 'need_based', NULL, 25.0, 'Female student, Good academic performance', '2024-06-30', '2024-25', 60, NULL),
    ('Disability Support Scholarship', 'For students with disabilities', 'need_based', NULL, 75.0, 'Valid disability certificate, Regular attendance', '2024-06-30', '2024-25', 15, NULL);

END $$;
