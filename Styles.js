// Styles.js
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  tutorialtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: "15%",
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: "19%", // Example offset from the top
  },
  tutorialbody1: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: "30%", // Example offset from the top
  },
  tutorialbody2: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: "34%", // Example offset from the top
  },
  tutorialbutton1: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    position: 'absolute',
    top: "36%", // Example offset from the top
  },
  tutorialbody3: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
    position: 'absolute',
    top: "50%", // Example offset from the top
  },
  tutorialbutton2: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    position: 'absolute',
    top: "56%", // Example offset from the top
  },
  tutorialtitle5: {
    fontSize: 20,
    margin: 5,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    textAlign: 'center',
    top: "75%", // Example offset from the top
  },
  inputxt4: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionButtonText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  footerImage: {
    width: '100%',
    height: 100,
    position: 'absolute',
    bottom: 0,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: "black",
    opacity: 10,
  },
  markerText: {
    opacity: 100,
    color: "white",
  },
  marker: {
    alignContent: "center",
    alignItems: "center",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
    marginTop: 50,
    backgroundColor: '#3F3F3F',
    color: "black",
    borderRadius: 50,
  },
  markeryou: {
    alignContent: "center",
    alignItems: "center",
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
    marginTop: 50,
    backgroundColor: 'blue',
    color: "white",
    borderRadius: 25,
    opacity: 0.9,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    height: '50%',
    width: 250,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  button: {
    alignContent: "center",
    alignItems: "center",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '70%',
    marginTop: 50,
    backgroundColor: '#388b02',
  },
  buttoncatch: {
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#388b02',
  },
  input: {
    alignContent: "center",
    alignItems: "center",
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  inputxt: {
    alignContent: "center",
    alignItems: "center",
    color: "black",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: 5,
    fontSize: 20,
  },
  inputxt1: {
    alignContent: "center",
    alignItems: "center",
    color: "white",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 20,
    fontSize: 25,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  mapButtonsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    alignItems: 'flex-end',
  },
  zoomButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  zoomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  locationButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  backButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});