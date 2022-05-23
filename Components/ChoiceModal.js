import { StyleSheet, Text,View,TouchableOpacity,TouchableHighlight } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import React from "react";
import { BUTTON_COLOR,primaryStyle } from '../styles/globStyles';

export default function ChoiceModal({openCamera,setShow,pickImage}){
    function handleGallerie(){
        pickImage();
    }

    function handlePhoto(){
        openCamera();
    }

    return(
        <TouchableOpacity onPress={()=>{setShow(false)}} style={styles.container}>
            <TouchableHighlight style={styles.layout}>

                <View style={styles.myLangue}>

                    <TouchableOpacity onPress={handlePhoto} style={{alignItems:"center"}}>
                        <Ionicons  name="ios-camera" size={50} color={BUTTON_COLOR} />
                        <Text style={primaryStyle.secondaryText}>Photos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleGallerie} style={{alignItems:"center"}}>
                        <Ionicons name="images" size={45} color={BUTTON_COLOR} />
                        <Text style={primaryStyle.secondaryText}>Gallerie</Text>
                    </TouchableOpacity>

                </View>
            </TouchableHighlight>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
 
    textLangue:{
        textAlign:"center",
        fontFamily:"Robotto-Bold",
        fontSize:25,
        color:"black",
        margin:"15%"
    },
    im:{
        margin:"10%"
    },
    selection:{
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
    },
    layout:{
        borderRadius:15,
        backgroundColor:"white",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
    },
    container:{
        justifyContent:"flex-end",
        alignItems:"center",
        width:"100%",
        height:"100%",
        backgroundColor:"rgba(0,0,0,.6)",
    },
    myLangue:{
        paddingTop:"5%",
        paddingBottom:"12%",
        width:"100%",
        flexDirection:"row",
        justifyContent:"space-around",
        alignItems:"baseline",
    },
})