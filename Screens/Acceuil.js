import { Camera } from 'expo-camera';
import { Text, View,TouchableOpacity } from 'react-native';
import { primaryStyle } from '../styles/globStyles';
import * as ImagePicker from 'expo-image-picker';

export default function Acceuil({navigation}){

	async function handleNavigatePhotos(){

		const permission = await ImagePicker.getCameraPermissionsAsync()
		if(permission.granted)
			navigation.navigate("Photos")
		else{
			const newPerm = await ImagePicker.requestCameraPermissionsAsync()
			if(newPerm.granted)
				navigation.navigate("Photos")

		}
	}

	async function handleNavigateDetection(){
		const permission = await Camera.getCameraPermissionsAsync()
		if(permission.granted)
			navigation.navigate("Detection")
		else{
			const newPerm = await Camera.requestCameraPermissionsAsync()
			if(newPerm.granted)
				navigation.navigate("Detection")
		}
	}


    return(
        <View style={primaryStyle.container}>

			<TouchableOpacity onPress={handleNavigatePhotos} style={primaryStyle.primaryButton}>
				<Text style={primaryStyle.primaryText}>Detection avec images</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={handleNavigateDetection} style={{...primaryStyle.primaryButton,marginTop:"5%"}}>
				<Text style={primaryStyle.primaryText}>Detection en Temps réel</Text>
			</TouchableOpacity>
			
		</View>
    )
}