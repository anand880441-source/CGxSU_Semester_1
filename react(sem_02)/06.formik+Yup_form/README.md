# **React Form Validation Project (Formik + Yup)**

## **Project Overview**

This project demonstrates how to build a **complete form validation system** in React using **Formik and Yup**.

The form includes:
- First Name
- Last Name
- Email
- Password
- Confirm Password
- Gender
- PDF Upload

Each field has **proper validation rules**.

> Goal: Learn how to build secure, clean, and professional forms.

---

## 📁 Recommended Folder Structure

```text
src/
├── forms/
│   └── LoginForm.jsx
|   └── loginForm.css
│
├── App.jsx
└── main.jsx
```

### Why This Structure?
- Keeps form logic separate
- Improves maintainability
- Makes project organized

---

## 🧩 Step 1: Install Required Libraries

```bash
npm install formik yup
```

### Explanation
- Formik → Manages form state
- Yup → Handles validation rules

---

## 🧩 Step 2: Create Form Component File

📄 **File Path:** `src/forms/LoginForm.jsx`

---

## 🧩 Step 3: Import Required Libraries

```js
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './loginForm.css'
```

### Explanation
- useFormik → Connects form to React
- Yup → Creates validation rules

---

## 🧩 Step 4: Define Initial Form Values

```js
const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
  file: null
};
```

### Explanation
- All form fields must exist here
- Formik uses this to store data

---

## 🧩 Step 5: Create Validation Schema (Yup)

```js
const validationSchema = Yup.object({

  firstName: Yup.string()
    .max(15, 'Maximum 15 characters allowed')
    .required('First name is required'),

  lastName: Yup.string()
    .max(20, 'Maximum 20 characters allowed')
    .required('Last name is required'),

  email: Yup.string()
    .matches(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/, 'Email must contain only letters and numbers')
    .required('Email is required'),

  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=(?:.*[!@#$%^&*]){2,}).{8,}$/,
      'Password must contain uppercase, lowercase, number and two special characters'
    )
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),

  gender: Yup.string()
    .required('Please select gender'),

  file: Yup.mixed()
    .required('PDF file is required')
    .test('fileType', 'Only PDF allowed', (value) => {
      return value && value.type === 'application/pdf';
    })
    .test('fileSize', 'File must be less than 10MB', (value) => {
      return value && value.size <= 10 * 1024 * 1024;
    })
});
```

### Explanation

#### First Name
- Maximum 15 characters
- Cannot be empty

#### Last Name
- Maximum 20 characters
- Cannot be empty

#### Email
- Only letters and numbers
- Proper email format

#### Password
- One uppercase
- One lowercase
- One number
- Two special characters
- Minimum 8 characters

#### Confirm Password
- Must match password

#### Gender
- Required selection

#### File
- Must be PDF
- Max size 10MB

---

## 🧩 Step 6: Initialize Formik

```js
const formik = useFormik({
  initialValues,
  validationSchema,
  onSubmit: (values) => {
    console.log(values);
    alert('Form Submitted Successfully');
  }
});
```

### Explanation
- Formik connects values and validation
- onSubmit runs after success

---
