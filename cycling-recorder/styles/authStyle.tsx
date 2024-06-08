// authStyle.tsx
import { StyleSheet } from 'react-native';

const authStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
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
    backgroundColor: '#01161E',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    marginBottom: 50,
    fontWeight: '500',
  },
});

export default authStyle;