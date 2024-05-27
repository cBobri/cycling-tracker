// authStyle.tsx
import { StyleSheet } from 'react-native';

const authStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#AEC3B0',
  },
  input: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#124559',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default authStyle;