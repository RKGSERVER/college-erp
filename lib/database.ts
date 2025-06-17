import { Pool } from "pg"

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Database query helper
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  const client = await pool.connect()

  try {
    const res = await client.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    client.release()
  }
}

// Transaction helper
export async function transaction(callback: (client: any) => Promise<any>) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
  } finally {
    client.release()
  }
}

// User-related database operations
export const userQueries = {
  // Get user by username or email
  async getUserByCredentials(identifier: string) {
    const result = await query(
      `SELECT u.*, up.first_name, up.last_name, up.department_id, d.name as department_name
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN departments d ON up.department_id = d.id
       WHERE u.username = $1 OR u.email = $1`,
      [identifier],
    )
    return result.rows[0]
  },

  // Get user with full profile
  async getUserWithProfile(userId: string) {
    const result = await query(
      `SELECT u.*, up.*, d.name as department_name, d.code as department_code
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN departments d ON up.department_id = d.id
       WHERE u.id = $1`,
      [userId],
    )
    return result.rows[0]
  },

  // Get student details
  async getStudentDetails(userId: string) {
    const result = await query(
      `SELECT s.*, u.username, u.email, up.first_name, up.last_name, d.name as department_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       JOIN departments d ON up.department_id = d.id
       WHERE s.user_id = $1`,
      [userId],
    )
    return result.rows[0]
  },

  // Get faculty details
  async getFacultyDetails(userId: string) {
    const result = await query(
      `SELECT f.*, u.username, u.email, up.first_name, up.last_name, d.name as department_name
       FROM faculty f
       JOIN users u ON f.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       JOIN departments d ON up.department_id = d.id
       WHERE f.user_id = $1`,
      [userId],
    )
    return result.rows[0]
  },

  // Get employee details
  async getEmployeeDetails(userId: string) {
    const result = await query(
      `SELECT e.*, u.username, u.email, up.first_name, up.last_name, d.name as department_name
       FROM employees e
       JOIN users u ON e.user_id = u.id
       JOIN user_profiles up ON u.id = up.user_id
       JOIN departments d ON up.department_id = d.id
       WHERE e.user_id = $1`,
      [userId],
    )
    return result.rows[0]
  },

  // Update user profile
  async updateUserProfile(userId: string, profileData: any) {
    return await transaction(async (client) => {
      // Update user table
      if (profileData.email || profileData.status) {
        await client.query(
          `UPDATE users SET 
           email = COALESCE($2, email),
           status = COALESCE($3, status),
           updated_at = CURRENT_TIMESTAMP
           WHERE id = $1`,
          [userId, profileData.email, profileData.status],
        )
      }

      // Update user_profiles table
      const profileFields = [
        "first_name",
        "last_name",
        "middle_name",
        "date_of_birth",
        "gender",
        "blood_group",
        "nationality",
        "religion",
        "category",
        "phone",
        "emergency_contact",
        "address",
        "city",
        "state",
        "country",
        "postal_code",
        "bio",
        "department_id",
      ]

      const updateFields = profileFields.filter((field) => profileData[field] !== undefined)

      if (updateFields.length > 0) {
        const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(", ")
        const values = [userId, ...updateFields.map((field) => profileData[field])]

        await client.query(
          `UPDATE user_profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`,
          values,
        )
      }

      return { success: true }
    })
  },

  // Get user permissions
  async getUserPermissions(userId: string) {
    const result = await query(
      `SELECT permission, resource FROM user_permissions 
       WHERE user_id = $1 AND is_active = true 
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
      [userId],
    )
    return result.rows
  },
}

// Course-related database operations
export const courseQueries = {
  // Get courses by department
  async getCoursesByDepartment(departmentId: string) {
    const result = await query(
      `SELECT c.*, d.name as department_name 
       FROM courses c
       JOIN departments d ON c.department_id = d.id
       WHERE c.department_id = $1 AND c.status = 'active'
       ORDER BY c.semester, c.year, c.course_code`,
      [departmentId],
    )
    return result.rows
  },

  // Get student enrollments
  async getStudentEnrollments(studentId: string, semester?: number, year?: number) {
    let query_text = `
      SELECT ce.*, c.course_code, c.course_name, c.credits, d.name as department_name
      FROM course_enrollments ce
      JOIN courses c ON ce.course_id = c.id
      JOIN departments d ON c.department_id = d.id
      WHERE ce.student_id = $1`

    const params = [studentId]

    if (semester) {
      query_text += ` AND ce.semester = $${params.length + 1}`
      params.push(semester)
    }

    if (year) {
      query_text += ` AND ce.year = $${params.length + 1}`
      params.push(year)
    }

    query_text += ` ORDER BY ce.year, ce.semester`

    const result = await query(query_text, params)
    return result.rows
  },

  // Get faculty course assignments
  async getFacultyCourses(facultyId: string, semester?: number, year?: number) {
    let query_text = `
      SELECT fca.*, c.course_code, c.course_name, c.credits, d.name as department_name
      FROM faculty_course_assignments fca
      JOIN courses c ON fca.course_id = c.id
      JOIN departments d ON c.department_id = d.id
      WHERE fca.faculty_id = $1 AND fca.status = 'active'`

    const params = [facultyId]

    if (semester) {
      query_text += ` AND fca.semester = $${params.length + 1}`
      params.push(semester)
    }

    if (year) {
      query_text += ` AND fca.year = $${params.length + 1}`
      params.push(year)
    }

    query_text += ` ORDER BY fca.year, fca.semester`

    const result = await query(query_text, params)
    return result.rows
  },
}

// Attendance-related database operations
export const attendanceQueries = {
  // Mark attendance
  async markAttendance(
    userId: string,
    courseId: string,
    date: string,
    status: string,
    markedBy: string,
    notes?: string,
  ) {
    const result = await query(
      `INSERT INTO attendance (user_id, course_id, date, status, marked_by, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, course_id, date) 
       DO UPDATE SET status = $4, marked_by = $5, notes = $6, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, courseId, date, status, markedBy, notes],
    )
    return result.rows[0]
  },

  // Get attendance for user
  async getUserAttendance(userId: string, courseId?: string, startDate?: string, endDate?: string) {
    let query_text = `
      SELECT a.*, c.course_code, c.course_name
      FROM attendance a
      LEFT JOIN courses c ON a.course_id = c.id
      WHERE a.user_id = $1`

    const params = [userId]

    if (courseId) {
      query_text += ` AND a.course_id = $${params.length + 1}`
      params.push(courseId)
    }

    if (startDate) {
      query_text += ` AND a.date >= $${params.length + 1}`
      params.push(startDate)
    }

    if (endDate) {
      query_text += ` AND a.date <= $${params.length + 1}`
      params.push(endDate)
    }

    query_text += ` ORDER BY a.date DESC`

    const result = await query(query_text, params)
    return result.rows
  },

  // Get attendance statistics
  async getAttendanceStats(userId: string, courseId?: string) {
    let query_text = `
      SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_days,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_days,
        ROUND(
          (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*)), 2
        ) as attendance_percentage
      FROM attendance 
      WHERE user_id = $1`

    const params = [userId]

    if (courseId) {
      query_text += ` AND course_id = $${params.length + 1}`
      params.push(courseId)
    }

    const result = await query(query_text, params)
    return result.rows[0]
  },
}

// Payment-related database operations
export const paymentQueries = {
  // Get student fee assignments
  async getStudentFees(studentId: string, status?: string) {
    let query_text = `
      SELECT sfa.*, fs.name as fee_name, fs.fee_type, fs.description
      FROM student_fee_assignments sfa
      JOIN fee_structures fs ON sfa.fee_structure_id = fs.id
      WHERE sfa.student_id = $1`

    const params = [studentId]

    if (status) {
      query_text += ` AND sfa.status = $${params.length + 1}`
      params.push(status)
    }

    query_text += ` ORDER BY sfa.due_date, sfa.created_at`

    const result = await query(query_text, params)
    return result.rows
  },

  // Create payment record
  async createPayment(paymentData: any) {
    const result = await query(
      `INSERT INTO payments (
        payment_id, user_id, fee_assignment_id, amount, currency, 
        payment_method, payment_gateway, gateway_payment_id, 
        gateway_order_id, status, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        paymentData.payment_id,
        paymentData.user_id,
        paymentData.fee_assignment_id,
        paymentData.amount,
        paymentData.currency,
        paymentData.payment_method,
        paymentData.payment_gateway,
        paymentData.gateway_payment_id,
        paymentData.gateway_order_id,
        paymentData.status,
        JSON.stringify(paymentData.metadata || {}),
      ],
    )
    return result.rows[0]
  },

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: string, metadata?: any) {
    const result = await query(
      `UPDATE payments SET 
       status = $2, 
       payment_date = CASE WHEN $2 = 'completed' THEN CURRENT_TIMESTAMP ELSE payment_date END,
       metadata = COALESCE($3, metadata),
       updated_at = CURRENT_TIMESTAMP
       WHERE payment_id = $1
       RETURNING *`,
      [paymentId, status, metadata ? JSON.stringify(metadata) : null],
    )
    return result.rows[0]
  },

  // Get payment history
  async getPaymentHistory(userId: string, limit = 50) {
    const result = await query(
      `SELECT p.*, sfa.amount as fee_amount, fs.name as fee_name, fs.fee_type
       FROM payments p
       LEFT JOIN student_fee_assignments sfa ON p.fee_assignment_id = sfa.id
       LEFT JOIN fee_structures fs ON sfa.fee_structure_id = fs.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2`,
      [userId, limit],
    )
    return result.rows
  },
}

// Notification-related database operations
export const notificationQueries = {
  // Create notification
  async createNotification(notificationData: any) {
    const result = await query(
      `INSERT INTO notifications (
        user_id, title, message, type, category, priority, 
        channels, expires_at, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        notificationData.user_id,
        notificationData.title,
        notificationData.message,
        notificationData.type,
        notificationData.category,
        notificationData.priority,
        notificationData.channels,
        notificationData.expires_at,
        JSON.stringify(notificationData.metadata || {}),
      ],
    )
    return result.rows[0]
  },

  // Get user notifications
  async getUserNotifications(userId: string, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    )
    return result.rows
  },

  // Mark notification as read
  async markNotificationRead(notificationId: string, userId: string) {
    const result = await query(
      `UPDATE notifications SET 
       is_read = true, 
       read_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [notificationId, userId],
    )
    return result.rows[0]
  },

  // Get unread notification count
  async getUnreadCount(userId: string) {
    const result = await query(
      `SELECT COUNT(*) as unread_count 
       FROM notifications 
       WHERE user_id = $1 AND is_read = false
       AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`,
      [userId],
    )
    return Number.parseInt(result.rows[0].unread_count)
  },
}

// Audit log operations
export const auditQueries = {
  // Create audit log
  async createAuditLog(auditData: any) {
    const result = await query(
      `INSERT INTO audit_logs (
        user_id, target_user_id, action, category, table_name, 
        record_id, field_name, old_value, new_value, 
        ip_address, user_agent, session_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        auditData.user_id,
        auditData.target_user_id,
        auditData.action,
        auditData.category,
        auditData.table_name,
        auditData.record_id,
        auditData.field_name,
        auditData.old_value,
        auditData.new_value,
        auditData.ip_address,
        auditData.user_agent,
        auditData.session_id,
        JSON.stringify(auditData.metadata || {}),
      ],
    )
    return result.rows[0]
  },

  // Get audit logs
  async getAuditLogs(filters: any = {}, limit = 100, offset = 0) {
    let query_text = `
      SELECT al.*, u.username, up.first_name, up.last_name,
             tu.username as target_username, tup.first_name as target_first_name, tup.last_name as target_last_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN users tu ON al.target_user_id = tu.id
      LEFT JOIN user_profiles tup ON tu.id = tup.user_id
      WHERE 1=1`

    const params: any[] = []

    if (filters.user_id) {
      query_text += ` AND al.user_id = $${params.length + 1}`
      params.push(filters.user_id)
    }

    if (filters.target_user_id) {
      query_text += ` AND al.target_user_id = $${params.length + 1}`
      params.push(filters.target_user_id)
    }

    if (filters.action) {
      query_text += ` AND al.action = $${params.length + 1}`
      params.push(filters.action)
    }

    if (filters.category) {
      query_text += ` AND al.category = $${params.length + 1}`
      params.push(filters.category)
    }

    if (filters.start_date) {
      query_text += ` AND al.created_at >= $${params.length + 1}`
      params.push(filters.start_date)
    }

    if (filters.end_date) {
      query_text += ` AND al.created_at <= $${params.length + 1}`
      params.push(filters.end_date)
    }

    query_text += ` ORDER BY al.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(query_text, params)
    return result.rows
  },
}

// Department operations
export const departmentQueries = {
  // Get all departments
  async getAllDepartments() {
    const result = await query(
      `SELECT d.*, u.username as hod_username, up.first_name as hod_first_name, up.last_name as hod_last_name
       FROM departments d
       LEFT JOIN users u ON d.head_of_department = u.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE d.status = 'active'
       ORDER BY d.name`,
    )
    return result.rows
  },

  // Get department by ID
  async getDepartmentById(departmentId: string) {
    const result = await query(
      `SELECT d.*, u.username as hod_username, up.first_name as hod_first_name, up.last_name as hod_last_name
       FROM departments d
       LEFT JOIN users u ON d.head_of_department = u.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE d.id = $1`,
      [departmentId],
    )
    return result.rows[0]
  },
}

// Scholarship operations
export const scholarshipQueries = {
  // Get available scholarships
  async getAvailableScholarships(departmentId?: string) {
    let query_text = `
      SELECT s.*, d.name as department_name
      FROM scholarships s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE s.is_active = true 
      AND s.application_deadline >= CURRENT_DATE`

    const params: any[] = []

    if (departmentId) {
      query_text += ` AND (s.department_id = $${params.length + 1} OR s.department_id IS NULL)`
      params.push(departmentId)
    }

    query_text += ` ORDER BY s.application_deadline, s.name`

    const result = await query(query_text, params)
    return result.rows
  },

  // Apply for scholarship
  async applyForScholarship(studentId: string, scholarshipId: string, documents: any) {
    const result = await query(
      `INSERT INTO scholarship_applications (student_id, scholarship_id, documents)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [studentId, scholarshipId, JSON.stringify(documents)],
    )
    return result.rows[0]
  },

  // Get student scholarship applications
  async getStudentApplications(studentId: string) {
    const result = await query(
      `SELECT sa.*, s.name as scholarship_name, s.amount, s.percentage, s.scholarship_type
       FROM scholarship_applications sa
       JOIN scholarships s ON sa.scholarship_id = s.id
       WHERE sa.student_id = $1
       ORDER BY sa.application_date DESC`,
      [studentId],
    )
    return result.rows
  },
}

export default pool
