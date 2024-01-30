import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { View, TextInput, Text, Modal, StyleSheet, Pressable, Keyboard } from 'react-native';
import CustomButton from './CustomButton';
import * as yup from 'yup';
import useThemeColors from '../hooks/useThemeColors';

const personSchema = yup.object({
  name: yup.string().required().max(30),
  pairId: yup.string().required().max(10),
});

const AddPersonModal = ({ modalVisible, closeModal, handleAddPerson, inputStyle }) => {
  const { themeStyles, appTheme } = useThemeColors();

  return (
    <Modal animationType='slide' transparent={true} visible={modalVisible} onRequestClose={closeModal}>
      <Pressable style={[styles.modal__container, themeStyles.background]} onPress={Keyboard.dismiss}>
        <View style={styles.modal}>
          <Formik
            initialValues={{ name: '', pairId: '' }}
            validationSchema={personSchema}
            onSubmit={(values, actions) => {
              handleAddPerson(values);
              actions.resetForm();
            }}
          >
            {(props) => (
              <View style={styles.modal__form}>
                <Text style={[styles.modal__label, themeStyles.fontColor]}>Name:</Text>
                {props.errors.name && <Text style={styles.modal__error}>{props.errors.name}</Text>}
                <TextInput
                  style={[styles.modal__input, themeStyles.fontColor]}
                  placeholder='Name'
                  placeholderTextColor={appTheme === 'light' ? '#0006' : '#fff6'}
                  onChangeText={props.handleChange('name')}
                  value={props.values.name}
                />
                <Text style={[styles.modal__label, themeStyles.fontColor]}>Add pair's id:</Text>
                <Text style={styles.modal__tip}>(write whatever you want, but it should be the same as your partner's id)</Text>
                {props.errors.pairId && <Text style={styles.modal__error}>{props.errors.pairId}</Text>}
                <TextInput
                  style={[styles.modal__input, themeStyles.fontColor]}
                  placeholder='Pair id'
                  placeholderTextColor={appTheme === 'light' ? '#0006' : '#fff6'}
                  onChangeText={props.handleChange('pairId')}
                  value={props.values.pairId}
                />
                <CustomButton
                  style={[styles.modal__button, styles.modal__add]}
                  textStyle={styles.modal__buttonText}
                  handler={props.handleSubmit}
                >
                  Add to list
                </CustomButton>
                <CustomButton style={[styles.modal__button, styles.modal__close]} textStyle={styles.modal__buttonText} handler={closeModal}>
                  Cancel and close
                </CustomButton>
              </View>
            )}
          </Formik>
        </View>
      </Pressable>
    </Modal>
  );
};

AddPersonModal.propTypes = {
  modalVisible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleAddPerson: PropTypes.func.isRequired,
  inputStyle: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  modal__container: {
    justifyContent: 'center',

    width: '100%',
    height: '100%',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  modal__label: {
    marginBottom: 4,

    fontSize: 20,
    color: '#333',
    fontWeight: '500',
  },
  modal__tip: {
    marginTop: -4,
    marginBottom: 4,
    color: '#a9a9a9',
  },
  modal__error: {
    fontSize: 16,
    color: '#DE3163',
    marginBottom: 4,
  },
  modal__input: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#828282',

    color: '#333',
    fontSize: 16,

    borderRadius: 4,
  },
  modal__button: {
    alignSelf: 'center',

    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,

    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  modal__buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modal__add: {
    marginBottom: 32,
    backgroundColor: '#2AAA8A',
  },
  modal__close: {
    backgroundColor: '#DE3163',
  },
});

export default AddPersonModal;
