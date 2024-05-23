import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#124559',
      },
      topContainer: {
        flex: 7, // 80% of the height
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#124559', // Adjust top container color
        paddingTop: 50,
      },
      bottomContainer: {
        flex: 3, // 20% of the height
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01161E', // Adjust bottom container color
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      },
      button: {
        borderRadius: 30,
        height: 50,
        width: '80%',
        backgroundColor: 'transparent',
        borderColor: '#FFFFFF',
        borderWidth: 1,

      },
      buttonContent: {
        height: 50,
        justifyContent: 'center',
      },
      buttonLabel: {
        fontSize: 18,
      },
      link: {
        justifyContent: 'center',
        marginVertical: 10,
      },
      image: {
        width: 300,
        resizeMode: 'contain',

      },
      title:{
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
      }
    });

export default styles;