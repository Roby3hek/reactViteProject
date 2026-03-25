import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReceiptContext } from '../../context/ReceiptContext';
import { v4 as uuidv4 } from 'uuid';


const currencies = ['₽', '$', '€', '₴'];

const AddReceiptForm = () => {
  const { addReceipt } = useContext(ReceiptContext);

  const formik = useFormik({
    initialValues: {
      title: '',
      amount: '',
      currency: '₽',
      date: new Date(),
      category: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Введите название чека'),
      amount: Yup.number()
        .typeError('Сумма должна быть числом')
        .positive('Сумма должна быть больше нуля')
        .required('Введите сумму'),
      currency: Yup.string().oneOf(currencies),
      date: Yup.date()
        .max(new Date(), 'Дата не может быть в будущем')
        .required('Введите дату'),
      category: Yup.string().required('Выберите категорию'),
    }),
    onSubmit: (values, { resetForm }) => {
      addReceipt({
        id: uuidv4(),
        title: values.title,
        amount: parseFloat(values.amount),
        currency: values.currency,
        date: values.date.toISOString(),
        category: values.category,
      });
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="mb-6 p-4 border rounded shadow-sm bg-white max-w-md">
      <div className="mb-4">
        <label htmlFor="title" className="block font-semibold mb-1">Название чека</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          className="w-full border px-2 py-1 rounded"
        />
        {formik.touched.title && formik.errors.title ? (
          <div className="text-red-600 text-sm">{formik.errors.title}</div>
        ) : null}
      </div>

      <div className="mb-4 flex space-x-2">
        <div className="flex-1">
          <label htmlFor="amount" className="block font-semibold mb-1">Сумма</label>
          <input
            id="amount"
            name="amount"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.amount}
            className="w-full border px-2 py-1 rounded"
          />
          {formik.touched.amount && formik.errors.amount ? (
            <div className="text-red-600 text-sm">{formik.errors.amount}</div>
          ) : null}
        </div>
        <div className="w-24">
          <label htmlFor="currency" className="block font-semibold mb-1">Валюта</label>
          <select
            id="currency"
            name="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border px-2 py-1 rounded"
          >
            {currencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="date" className="block font-semibold mb-1">Дата</label>
        <DatePicker
          id="date"
          selected={formik.values.date}
          onChange={date => formik.setFieldValue('date', date)}
          maxDate={new Date()}
          dateFormat="dd.MM.yyyy"
          className="w-full border px-2 py-1 rounded"
        />
        {formik.touched.date && formik.errors.date ? (
          <div className="text-red-600 text-sm">{formik.errors.date}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block font-semibold mb-1">Категория расхода</label>
        <select
          id="category"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="">Выберите категорию</option>
          <option value="Продукты">Продукты</option>
          <option value="Транспорт">Транспорт</option>
          <option value="Развлечения">Развлечения</option>
          <option value="Коммунальные услуги">Коммунальные услуги</option>
          <option value="Другое">Другое</option>
        </select>
        {formik.touched.category && formik.errors.category ? (
          <div className="text-red-600 text-sm">{formik.errors.category}</div>
        ) : null}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Добавить чек
      </button>
    </form>
  );
};

export default AddReceiptForm;
