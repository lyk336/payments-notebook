import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const SortMethodPicker = ({ value, handleSortChange }) => {
  return (
    <View style={styles.picker__container}>
      <RNPickerSelect
        style={styles}
        onValueChange={handleSortChange}
        value={value}
        placeholder={{}}
        items={[
          { label: 'Sort by alphabet', value: 'byAlphabet' },
          { label: 'Sort by pair', value: 'byPair' },
          { label: 'Sort by money', value: 'byMoney' },
          { label: 'Sort by last update', value: 'byUpdate' },
        ]}
      />
    </View>
  );
};

SortMethodPicker.propTypes = {
  value: PropTypes.string.isRequired,
  handleSortChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  inputAndroid: {
    backgroundColor: '#fff',
  },
  picker__container: {
    marginTop: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
  },
});

export default SortMethodPicker;
