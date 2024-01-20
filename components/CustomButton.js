import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomButton = ({ style, textStyle, handler, children }) => {
  return (
    <TouchableOpacity style={style} onPress={handler}>
      <Text style={[styles.textDefaultStyle, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

CustomButton.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.object,
  handler: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  textDefaultStyle: {
    textAlign: 'center',
  },
});
export default CustomButton;
