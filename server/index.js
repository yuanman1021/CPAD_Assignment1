// server/index.js
const express = require('express')
const cors = require('cors')
const pool = require('./db')

const app = express()

app.use(cors()) // allow requests from http://localhost:5174
app.use(express.json()) // parse application/json request bodies

// health check
app.get('/', (req, res) => {
  res.json({ status: 'Employee Directory API running' })
})

// read list (with optional search & sort)
app.get('/employees', async (req, res) => {
  try {
    const { q, sortBy, order } = req.query

    let sql = 'SELECT * FROM employees'
    const params = []

    if (q) {
      sql += ` WHERE name LIKE ?
        OR empId LIKE ?
        OR email LIKE ?
        OR department LIKE ?`

      const like = `%${q}%`
      params.push(like, like, like, like)
    }

    const allowedSort = ['name', 'hireDate', 'salary']

    if (sortBy && allowedSort.includes(sortBy)) {
      const direction = order === 'desc' ? 'DESC' : 'ASC'
      sql += ` ORDER BY ${sortBy} ${direction}`
    } else {
      sql += ' ORDER BY id ASC'
    }

    const [rows] = await pool.query(sql, params)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error while fetching employees.' })
  }
})

// read single
app.get('/employees/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM employees WHERE id = ?',
      [req.params.id]
    )

    if (!rows.length) {
      return res.status(404).json({ error: 'Employee not found.' })
    }

    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Database error while fetching employee.' })
  }
})

// create
app.post('/employees', async (req, res) => {
  try {
    const {
      empId,
      name,
      email,
      department,
      position,
      hireDate,
      salary,
      active
    } = req.body

    const [result] = await pool.query(
      `INSERT INTO employees
      (empId, name, email, department, position, hireDate, salary, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        empId,
        name,
        email,
        department,
        position,
        hireDate,
        salary,
        active ? 1 : 0
      ]
    )

    res.status(201).json({
      id: result.insertId,
      ...req.body
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Employee ID already exists.' })
    }

    console.error(err)
    res.status(500).json({ error: 'Database error while creating employee.' })
  }
})

// update
app.put('/employees/:id', async (req, res) => {
  try {
    const {
      empId,
      name,
      email,
      department,
      position,
      hireDate,
      salary,
      active
    } = req.body

    const [result] = await pool.query(
      `UPDATE employees SET
        empId = ?,
        name = ?,
        email = ?,
        department = ?,
        position = ?,
        hireDate = ?,
        salary = ?,
        active = ?
      WHERE id = ?`,
      [
        empId,
        name,
        email,
        department,
        position,
        hireDate,
        salary,
        active ? 1 : 0,
        req.params.id
      ]
    )

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Employee not found.' })
    }

    res.json({
      id: Number(req.params.id),
      ...req.body
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Employee ID already exists.' })
    }

    console.error(err)
    res.status(500).json({ error: 'Database error while updating employee.' })
  }
})

// delete
app.delete('/employees/:id', async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM employees WHERE id = ?',
      [req.params.id]
    )

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Employee not found.' })
    }

    res.json({ deleted: true })
  } catch (err) {
    res.status(500).json({ error: 'Database error while deleting employee.' })
  }
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`)
})