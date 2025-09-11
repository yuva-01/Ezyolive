import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createAppointment } from '../../features/appointments/appointmentSlice';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AppointmentForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const { isLoading } = useSelector((state) => state.appointments);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initial form values
  const initialValues = {
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    date: startDate,
    duration: 30,
    reason: '',
    status: 'scheduled',
    notes: '',
    type: 'in-person',
    followUp: false,
  };

  // Form validation schema
  const validationSchema = Yup.object({
    patientName: Yup.string().required('Patient name is required'),
    doctorName: Yup.string().required('Doctor name is required'),
    reason: Yup.string().required('Reason for appointment is required'),
    duration: Yup.number()
      .required('Duration is required')
      .min(15, 'Minimum duration is 15 minutes')
      .max(120, 'Maximum duration is 120 minutes'),
  });

  // Handle form submission
  const handleSubmit = (values, { resetForm }) => {
    dispatch(createAppointment(values))
      .unwrap()
      .then(() => {
        toast.success('Appointment created successfully');
        navigate('/appointments');
      })
      .catch((error) => {
        toast.error(error || 'Failed to create appointment');
      });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Appointment</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create a new appointment for a patient
          </p>
        </div>
      </div>

      <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  {/* Patient Information */}
                  <div>
                    <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                      Patient Name
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="patientName"
                        id="patientName"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter patient name"
                      />
                      <ErrorMessage name="patientName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Doctor Information */}
                  <div>
                    <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
                      Doctor Name
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="doctorName"
                        id="doctorName"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter doctor name"
                      />
                      <ErrorMessage name="doctorName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date and Time
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        selected={values.date}
                        onChange={(date) => {
                          setStartDate(date);
                          setFieldValue('date', date);
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Duration (minutes)
                    </label>
                    <div className="mt-1">
                      <Field
                        type="number"
                        name="duration"
                        id="duration"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        min="15"
                        max="120"
                        step="15"
                      />
                      <ErrorMessage name="duration" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Appointment Type
                    </label>
                    <div className="mt-1">
                      <Field
                        as="select"
                        name="type"
                        id="type"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="in-person">In Person</option>
                        <option value="telehealth">Telehealth</option>
                      </Field>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1">
                      <Field
                        as="select"
                        name="status"
                        id="status"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Field>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="sm:col-span-2">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Reason for Appointment
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="reason"
                        id="reason"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter reason for appointment"
                      />
                      <ErrorMessage name="reason" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <div className="mt-1">
                      <Field
                        as="textarea"
                        name="notes"
                        id="notes"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Any additional notes"
                      />
                    </div>
                  </div>

                  {/* Follow-up Checkbox */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="followUp"
                        id="followUp"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="followUp" className="ml-2 block text-sm text-gray-700">
                        This is a follow-up appointment
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate('/appointments')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? 'Creating...' : 'Create Appointment'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
