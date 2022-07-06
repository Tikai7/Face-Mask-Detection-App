import { Camera } from 'expo-camera';
import { Text, View,TouchableOpacity,Switch } from 'react-native';
import { primaryStyle } from '../styles/globStyles';
import * as ImagePicker from 'expo-image-picker';
import React,{useState} from "react"

export default function Acceuil({navigation}){
    const [clickIt,setClick] = useState(false)

	async function handleNavigatePhotos(){

		const permission = await ImagePicker.getCameraPermissionsAsync()
		if(permission.granted)
			navigation.navigate("Photos",{clickIt})
		else{
			const newPerm = await ImagePicker.requestCameraPermissionsAsync()
			if(newPerm.granted)
				navigation.navigate("Photos",{clickIt})

		}
	}

	async function handleNavigateDetection(){
		const permission = await Camera.getCameraPermissionsAsync()
		if(permission.granted)
			navigation.navigate("Detection",{clickIt})
		else{
			const newPerm = await Camera.requestCameraPermissionsAsync()
			if(newPerm.granted)
				navigation.navigate("Detection",{clickIt})
		}
	}


    return(
        <View style={primaryStyle.container}>
			<View style={{flexDirection:"row",alignItems:"center",marginBottom:"10%"}}>
				<Text style={{...primaryStyle.primaryText,marginRight:"2%"}}>Utiliser notre modèle</Text>
				<Switch
					trackColor={{ false: "#767577", true: "#4BB543" }}
					thumbColor="#FFFFFF"
					ios_backgroundColor="#3e3e3e"
					onValueChange={()=>setClick((old)=>!old)}
					value={clickIt}    
				/>
			</View>
			<TouchableOpacity onPress={handleNavigatePhotos} style={primaryStyle.primaryButton}>
				<Text style={primaryStyle.primaryText}>Detection avec images</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={handleNavigateDetection} style={{...primaryStyle.primaryButton,marginTop:"5%"}}>
				<Text style={primaryStyle.primaryText}>Detection en Temps réel</Text>
			</TouchableOpacity>
			
		</View>
    )
}