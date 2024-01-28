import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { TextInput, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

const ChangeBalanceInput = ({ balance, handleSubmit, id, insufficientMoney }) => {
  const formik = useFormik({
    initialValues: {
      balance: JSON.stringify(balance),
    },
    onSubmit: (values) => {
      handleSubmit(values.balance, id);
    },
  });

  const [inputValue, setInputValue] = useState(JSON.stringify(balance));

  // update input's value when button pressed
  useEffect(() => {
    formik.values.balance = JSON.stringify(balance);
    setInputValue(formik.values.balance);
  }, [balance]);

  // update input's value on text change
  useEffect(() => {
    setInputValue(formik.values.balance);
  }, [formik.values.balance]);

  return (
    <TextInput
      style={[
        styles.input,
        {
          color: insufficientMoney ? '#DE3163' : '#2AAA8A',
          backgroundColor: insufficientMoney ? 'rgba(222, 49, 99, 0.05)' : 'transparent',
        },
      ]}
      placeholder='0'
      keyboardType='numeric'
      maxLength={3}
      onChangeText={formik.handleChange('balance')}
      value={inputValue}
      onBlur={formik.handleSubmit}
    />
  );
};

ChangeBalanceInput.propTypes = {
  balance: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  insufficientMoney: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  input: {
    marginTop: -5,
    marginBottom: -6,
    width: 40,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',

    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',

    borderRadius: 4,
  },
});

export default ChangeBalanceInput;
