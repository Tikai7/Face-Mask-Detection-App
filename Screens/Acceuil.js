import { Text, View,TouchableOpacity } from 'react-native';
import { primaryStyle } from '../styles/globStyles';

export default function Acceuil({navigation}){
    return(
        <View style={primaryStyle.container}>

			<TouchableOpacity onPress={()=>navigation.navigate("Photos")} style={primaryStyle.primaryButton}>
				<Text style={primaryStyle.primaryText}>Detection avec images</Text>
			</TouchableOpacity>

			<TouchableOpacity onPress={()=>navigation.navigate("Detection")} style={{...primaryStyle.primaryButton,marginTop:"5%"}}>
				<Text style={primaryStyle.primaryText}>Detection en Temps réel</Text>
			</TouchableOpacity>
			
		</View>
    )
}