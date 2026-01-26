import { useFormik } from 'formik';
import * as Yup from 'yup';
import './LoginForm.css'
const RegisterForm = () => {

  // Initial form values
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    file: null
  };

  // Validation rules
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

  // Connect Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      alert('Form Submitted Successfully');
    }
  });

return (
  <div className="form-container">

    <form className="register-form" onSubmit={formik.handleSubmit}>

      <h2>Register Form</h2>

      {/* First Name */}
      <div className="form-group">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
        />

        {formik.touched.firstName && formik.errors.firstName && (
          <p className="error">{formik.errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="form-group">
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
        />

        {formik.touched.lastName && formik.errors.lastName && (
          <p className="error">{formik.errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />

        {formik.touched.email && formik.errors.email && (
          <p className="error">{formik.errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="form-group">
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />

        {formik.touched.password && formik.errors.password && (
          <p className="error">{formik.errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />

        {formik.touched.confirmPassword &&
          formik.errors.confirmPassword && (
            <p className="error">{formik.errors.confirmPassword}</p>
          )}
      </div>

      {/* Gender */}
      <div className="form-group">
        <select
          name="gender"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.gender}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {formik.touched.gender && formik.errors.gender && (
          <p className="error">{formik.errors.gender}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="form-group">
        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => {
            formik.setFieldValue(
              'file',
              event.currentTarget.files[0]
            );
          }}
        />

        {formik.touched.file && formik.errors.file && (
          <p className="error">{formik.errors.file}</p>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="submit-btn">
        Register
      </button>

    </form>
  </div>
);
};

export default RegisterForm;
