CREATE DATABASE IF NOT EXISTS employee_directory
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE employee_directory;

DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empId VARCHAR(8) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL,
  department VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  hireDate DATE NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  active TINYINT(1) NOT NULL DEFAULT 1,
  CHECK (salary >= 1500 AND salary <= 50000)
) ENGINE=InnoDB;

INSERT INTO employees
  (empId, name, email, department, position, hireDate, salary, active)
VALUES
  ('EMP001', 'Ahmad Zulkarnain', 'ahmad.zulkarnain@company.com', 'IT', 'Software Engineer', '2021-03-15', 5200.00, 1),
  ('EMP002', 'Nur Aisyah Abdullah', 'nur.aisyah@company.com', 'HR', 'HR Executive', '2020-07-01', 4300.00, 1),
  ('EMP003', 'Tan Wei Ming', 'tan.weiming@company.com', 'Finance', 'Account Executive', '2019-11-20', 4800.00, 1),
  ('EMP004', 'Siti Khadijah Ibrahim', 'siti.khadijah@company.com', 'Marketing', 'Marketing Officer', '2022-01-10', 3900.00, 1),
  ('EMP005', 'Muhammad Faris Razak', 'faris.razak@company.com', 'Operations', 'Operations Supervisor', '2018-05-25', 6100.00, 0),
  ('EMP006', 'Lim Jia Xin', 'lim.jiaxin@company.com', 'IT', 'UI Designer', '2023-02-06', 4500.00, 1),
  ('EMP007', 'Raj Kumar', 'raj.kumar@company.com', 'Finance', 'Finance Manager', '2017-09-12', 8900.00, 1);