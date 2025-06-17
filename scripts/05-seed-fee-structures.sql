-- Seed fee structures
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

    -- Tuition Fees by Department and Year
    INSERT INTO fee_structures (name, description, fee_type, amount, frequency, department_id, program, year, is_mandatory, late_fee_percentage) VALUES
    -- Computer Science Fees
    ('CSE Tuition Fee - Year 1', 'Annual tuition fee for CSE first year', 'tuition', 80000.00, 'annual', cse_dept_id, 'B.Tech Computer Science', 1, true, 5.00),
    ('CSE Tuition Fee - Year 2', 'Annual tuition fee for CSE second year', 'tuition', 85000.00, 'annual', cse_dept_id, 'B.Tech Computer Science', 2, true, 5.00),
    ('CSE Tuition Fee - Year 3', 'Annual tuition fee for CSE third year', 'tuition', 90000.00, 'annual', cse_dept_id, 'B.Tech Computer Science', 3, true, 5.00),
    ('CSE Tuition Fee - Year 4', 'Annual tuition fee for CSE fourth year', 'tuition', 95000.00, 'annual', cse_dept_id, 'B.Tech Computer Science', 4, true, 5.00),
    
    -- Electronics Fees
    ('ECE Tuition Fee - Year 1', 'Annual tuition fee for ECE first year', 'tuition', 75000.00, 'annual', ece_dept_id, 'B.Tech Electronics', 1, true, 5.00),
    ('ECE Tuition Fee - Year 2', 'Annual tuition fee for ECE second year', 'tuition', 80000.00, 'annual', ece_dept_id, 'B.Tech Electronics', 2, true, 5.00),
    ('ECE Tuition Fee - Year 3', 'Annual tuition fee for ECE third year', 'tuition', 85000.00, 'annual', ece_dept_id, 'B.Tech Electronics', 3, true, 5.00),
    ('ECE Tuition Fee - Year 4', 'Annual tuition fee for ECE fourth year', 'tuition', 90000.00, 'annual', ece_dept_id, 'B.Tech Electronics', 4, true, 5.00),
    
    -- Mechanical Fees
    ('MECH Tuition Fee - Year 1', 'Annual tuition fee for Mechanical first year', 'tuition', 70000.00, 'annual', mech_dept_id, 'B.Tech Mechanical', 1, true, 5.00),
    ('MECH Tuition Fee - Year 2', 'Annual tuition fee for Mechanical second year', 'tuition', 75000.00, 'annual', mech_dept_id, 'B.Tech Mechanical', 2, true, 5.00),
    ('MECH Tuition Fee - Year 3', 'Annual tuition fee for Mechanical third year', 'tuition', 80000.00, 'annual', mech_dept_id, 'B.Tech Mechanical', 3, true, 5.00),
    ('MECH Tuition Fee - Year 4', 'Annual tuition fee for Mechanical fourth year', 'tuition', 85000.00, 'annual', mech_dept_id, 'B.Tech Mechanical', 4, true, 5.00),
    
    -- Common Fees for All Departments
    ('Hostel Fee', 'Annual hostel accommodation fee', 'hostel', 45000.00, 'annual', NULL, NULL, NULL, false, 10.00),
    ('Transport Fee', 'Annual bus transportation fee', 'transport', 12000.00, 'annual', NULL, NULL, NULL, false, 10.00),
    ('Library Fee', 'Annual library access fee', 'library', 5000.00, 'annual', NULL, NULL, NULL, true, 5.00),
    ('Lab Fee', 'Semester laboratory fee', 'lab', 8000.00, 'semester', NULL, NULL, NULL, true, 5.00),
    ('Exam Fee', 'Semester examination fee', 'exam', 3000.00, 'semester', NULL, NULL, NULL, true, 5.00),
    ('Sports Fee', 'Annual sports and recreation fee', 'other', 2000.00, 'annual', NULL, NULL, NULL, false, 5.00),
    ('Medical Fee', 'Annual medical and health services fee', 'other', 3000.00, 'annual', NULL, NULL, NULL, true, 5.00),
    ('Development Fee', 'Annual infrastructure development fee', 'other', 10000.00, 'annual', NULL, NULL, NULL, true, 5.00);

END $$;
