import { createStackNavigator } from '@react-navigation/stack';
import { View,Text } from 'react-native';
import { primaryStyle,BUTTON_COLOR, SECONDARY_COLOR } from '../styles/globStyles';
import { Ionicons } from '@expo/vector-icons'; 

import React,{ useState,useEffect } from 'react';
import Acceuil from '../Screens/Acceuil';
import Detection from '../Screens/Detection';
import ImageDetector from '../Screens/ImageDetector';

const Stack = createStackNavigator();

export default function AcceuilStack() {

    function AcceuilHeader({route,navigation}){

        const [cond,setCond] = useState(false)

        useEffect(()=>{
            setCond(route.name==="Detection" || route.name === "Photos")
        },[route])

        return (
            <View style={{
                backgroundColor:BUTTON_COLOR,
                paddingTop: cond ? "15%" : "16.5%",
                flexDirection:"row-reverse",
                paddingBottom:"5%",
                justifyContent:"center",
                alignItems:"center"
            }}>
                
                <Text style={{...primaryStyle.primaryText,flex:1,marginLeft: cond ? "-10%" : 0}}>{route.name}</Text>
                {
                    cond?(
                        <Ionicons style={{alignItems:"flex-start",paddingLeft:"5%"}} onPress={()=>navigation.pop()} name="arrow-back-outline" size={24} color={SECONDARY_COLOR} />
                    ):null
                }
            </View>
        )
    }

    const options = {
        header : (props) => <AcceuilHeader {...props} />
    }

    return (
        <Stack.Navigator >
            <Stack.Screen name="Acceuil" component={Acceuil} options={options} />
            <Stack.Screen name="Detection" component={Detection} options={options} />
            <Stack.Screen name="Photos" component={ImageDetector} options={options} />

        </Stack.Navigator>
    );
}