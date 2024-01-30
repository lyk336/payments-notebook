import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as yup from 'yup';
import { TextInput, Text, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

const priceSchema = yup.object({
  price: yup.number().required('').positive().typeError('Must be a number'),
});

const ChangePriceInput = ({ handleChangePrice, handleCancel, fontColor }) => {
  return (
    <Formik
      initialValues={{ price: '' }}
      validationSchema={priceSchema}
      onSubmit={(values) => {
        handleChangePrice(+values.price);
      }}
    >
      {(props) => (
        <>
          {props.errors.price && <Text style={styles.error}>{props.errors.price}</Text>}
          <TextInput
            style={[styles.options__input, { color: fontColor }]}
            placeholder='New Price'
            placeholderTextColor={`${fontColor}6`}
            maxLength={3}
            onChangeText={props.handleChange('price')}
            value={props.values.price}
            keyboardType='numeric'
          />
          <CustomButton handler={props.handleSubmit} style={[styles.button, styles.confirm]} textStyle={{ color: '#fff' }}>
            Confirm
          </CustomButton>
          <CustomButton handler={handleCancel} style={[styles.button, styles.cancel]} textStyle={{ color: '#fff' }}>
            Cancel
          </CustomButton>
        </>
      )}
    </Formik>
  );
};

ChangePriceInput.propTypes = {
  handleChangePrice: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  fontColor: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  options__input: {
    maxWidth: 150,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#a3a3a3',
    borderStyle: 'solid',

    borderRadius: 4,
  },
  button: {
    maxWidth: 150,
    paddingVertical: 4,

    borderRadius: 4,
  },
  confirm: {
    backgroundColor: '#2AAA8A',
    marginBottom: 8,
  },
  cancel: {
    backgroundColor: '#DE3163',
  },
  error: {
    color: '#DE3163',
    marginBottom: 4,
  },
});

export default ChangePriceInput;
