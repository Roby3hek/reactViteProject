import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ReceiptContext } from '../../context/ReceiptContext';

const currencies = ['₽', '$', '€', '₴'];

const EditReceiptModal = ({ receipt, onClose }) => {
  const { editReceipt } = useContext(ReceiptContext);

  const formik = useFormik({
    initialValues: {
      title: receipt.title,
      amount: receipt.amount,
      currency: receipt.currency,
      date: new Date(receipt.date),
      category: receipt.category,
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
    onSubmit: (values) => {
      editReceipt(receipt.id, {
        title: values.title,
        amount: parseFloat(values.amount),
        currency: values.currency,
        date: values.date.toISOString(),
        category: values.category,
      });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Редактировать чек</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="block font-semibold mb-1" htmlFor="title">Название чека</label>
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

          <div className="mb-3 flex space-x-2">
            <div className="flex-1">
              <label className="block font-semibold mb-1" htmlFor="amount">Сумма</label>
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
              <label className="block font-semibold mb-1" htmlFor="currency">Валюта</label>
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

          <div className="mb-3">
            <label className="block font-semibold mb-1" htmlFor="date">Дата</label>
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
            <label className="block font-semibold mb-1" htmlFor="category">Категория расхода</label>
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

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReceiptModal;
