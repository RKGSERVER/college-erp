-- Seed user permissions based on roles
DO $$
DECLARE
    admin_user_id UUID;
    principal_user_id UUID;
    faculty1_user_id UUID;
    faculty2_user_id UUID;
    student1_user_id UUID;
    student2_user_id UUID;
    employee1_user_id UUID;
    employee2_user_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO admin_user_id FROM users WHERE username = 'admin';
    SELECT id INTO principal_user_id FROM users WHERE username = 'principal';
    SELECT id INTO faculty1_user_id FROM users WHERE username = 'sarah.johnson';
    SELECT id INTO faculty2_user_id FROM users WHERE username = 'michael.brown';
    SELECT id INTO student1_user_id FROM users WHERE username = 'john.smith';
    SELECT id INTO student2_user_id FROM users WHERE username = 'emily.davis';
    SELECT id INTO employee1_user_id FROM users WHERE username = 'mike.wilson';
    SELECT id INTO employee2_user_id FROM users WHERE username = 'lisa.anderson';

    -- Admin permissions (full access)
    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (admin_user_id, 'full_access', '*', admin_user_id),
    (admin_user_id, 'manage_users', 'users', admin_user_id),
    (admin_user_id, 'manage_roles', 'roles', admin_user_id),
    (admin_user_id, 'manage_departments', 'departments', admin_user_id),
    (admin_user_id, 'manage_courses', 'courses', admin_user_id),
    (admin_user_id, 'manage_fees', 'fees', admin_user_id),
    (admin_user_id, 'manage_scholarships', 'scholarships', admin_user_id),
    (admin_user_id, 'view_all_reports', 'reports', admin_user_id),
    (admin_user_id, 'manage_system_settings', 'settings', admin_user_id),
    (admin_user_id, 'manage_notifications', 'notifications', admin_user_id),
    (admin_user_id, 'view_audit_logs', 'audit', admin_user_id);

    -- Principal permissions (high-level access)
    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (principal_user_id, 'view_all_users', 'users', admin_user_id),
    (principal_user_id, 'approve_requests', 'requests', admin_user_id),
    (principal_user_id, 'view_all_reports', 'reports', admin_user_id),
    (principal_user_id, 'manage_policies', 'policies', admin_user_id),
    (principal_user_id, 'view_financial_reports', 'finance', admin_user_id),
    (principal_user_id, 'manage_announcements', 'announcements', admin_user_id),
    (principal_user_id, 'view_attendance_reports', 'attendance', admin_user_id),
    (principal_user_id, 'manage_scholarships', 'scholarships', admin_user_id),
    (principal_user_id, 'view_audit_logs', 'audit', admin_user_id);

    -- Faculty permissions
    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (faculty1_user_id, 'manage_courses', 'own_courses', admin_user_id),
    (faculty1_user_id, 'grade_students', 'students', admin_user_id),
    (faculty1_user_id, 'manage_attendance', 'attendance', admin_user_id),
    (faculty1_user_id, 'view_student_profiles', 'students', admin_user_id),
    (faculty1_user_id, 'create_assignments', 'assignments', admin_user_id),
    (faculty1_user_id, 'view_course_reports', 'reports', admin_user_id),
    (faculty1_user_id, 'manage_course_content', 'content', admin_user_id),
    (faculty1_user_id, 'communicate_students', 'communication', admin_user_id);

    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (faculty2_user_id, 'manage_courses', 'own_courses', admin_user_id),
    (faculty2_user_id, 'grade_students', 'students', admin_user_id),
    (faculty2_user_id, 'manage_attendance', 'attendance', admin_user_id),
    (faculty2_user_id, 'view_student_profiles', 'students', admin_user_id),
    (faculty2_user_id, 'create_assignments', 'assignments', admin_user_id),
    (faculty2_user_id, 'view_course_reports', 'reports', admin_user_id),
    (faculty2_user_id, 'manage_course_content', 'content', admin_user_id),
    (faculty2_user_id, 'communicate_students', 'communication', admin_user_id);

    -- Student permissions
    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (student1_user_id, 'view_courses', 'courses', admin_user_id),
    (student1_user_id, 'view_grades', 'own_grades', admin_user_id),
    (student1_user_id, 'view_attendance', 'own_attendance', admin_user_id),
    (student1_user_id, 'submit_assignments', 'assignments', admin_user_id),
    (student1_user_id, 'make_payments', 'payments', admin_user_id),
    (student1_user_id, 'apply_scholarships', 'scholarships', admin_user_id),
    (student1_user_id, 'view_announcements', 'announcements', admin_user_id),
    (student1_user_id, 'update_profile', 'own_profile', admin_user_id),
    (student1_user_id, 'view_fee_details', 'own_fees', admin_user_id);

    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (student2_user_id, 'view_courses', 'courses', admin_user_id),
    (student2_user_id, 'view_grades', 'own_grades', admin_user_id),
    (student2_user_id, 'view_attendance', 'own_attendance', admin_user_id),
    (student2_user_id, 'submit_assignments', 'assignments', admin_user_id),
    (student2_user_id, 'make_payments', 'payments', admin_user_id),
    (student2_user_id, 'apply_scholarships', 'scholarships', admin_user_id),
    (student2_user_id, 'view_announcements', 'announcements', admin_user_id),
    (student2_user_id, 'update_profile', 'own_profile', admin_user_id),
    (student2_user_id, 'view_fee_details', 'own_fees', admin_user_id);

    -- Employee permissions
    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (employee1_user_id, 'manage_records', 'student_records', admin_user_id),
    (employee1_user_id, 'process_documents', 'documents', admin_user_id),
    (employee1_user_id, 'view_reports', 'department_reports', admin_user_id),
    (employee1_user_id, 'handle_requests', 'student_requests', admin_user_id),
    (employee1_user_id, 'update_student_info', 'student_info', admin_user_id),
    (employee1_user_id, 'generate_certificates', 'certificates', admin_user_id),
    (employee1_user_id, 'manage_admissions', 'admissions', admin_user_id);

    INSERT INTO user_permissions (user_id, permission, resource, granted_by) VALUES
    (employee2_user_id, 'manage_finances', 'finance', admin_user_id),
    (employee2_user_id, 'process_payments', 'payments', admin_user_id),
    (employee2_user_id, 'generate_invoices', 'invoices', admin_user_id),
    (employee2_user_id, 'view_financial_reports', 'finance_reports', admin_user_id),
    (employee2_user_id, 'manage_scholarships', 'scholarship_processing', admin_user_id),
    (employee2_user_id, 'handle_fee_queries', 'fee_support', admin_user_id),
    (employee2_user_id, 'manage_budgets', 'budgets', admin_user_id);

END $$;
