import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import useThemeColors from '../hooks/useThemeColors';

const PriceGroupPicker = ({ value, personId, handleGroupChange, priceGroupesList }) => {
  const { appTheme } = useThemeColors();

  const pickerItems = priceGroupesList.map((group) => ({
    label: group.groupName,
    value: group.groupName,
    key: group.groupName,
  }));
  return (
    <View style={styles.picker__container}>
      <RNPickerSelect
        style={{
          inputAndroid: {
            backgroundColor: appTheme === 'light' ? '#fff' : '#525252',
            color: appTheme === 'light' ? '#000' : '#fff',
          },
        }}
        onValueChange={(value) => {
          handleGroupChange(value, personId);
        }}
        value={value}
        placeholder={{}}
        items={[{ label: 'none', value: 'default', key: 'default' }, ...pickerItems]}
      />
    </View>
  );
};

PriceGroupPicker.propTypes = {
  value: PropTypes.string.isRequired,
  personId: PropTypes.string.isRequired,
  handleGroupChange: PropTypes.func.isRequired,
  priceGroupesList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const styles = StyleSheet.create({
  picker__container: {
    marginTop: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e5e5e5',
  },
});

export default PriceGroupPicker;
