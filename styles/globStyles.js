import { StyleSheet } from "react-native"

export const BG_COLOR = "#0E121B"
export const BUTTON_COLOR = "#00D9F6"
export const SECONDARY_COLOR = "#FFFFFF"
export const PLACEHOLDER_COLOR = "#999999"


export const primaryStyle = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BG_COLOR,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text : {
		color : SECONDARY_COLOR
	},
    primaryText: {
        textAlign:"center",
        fontSize:17,
        fontWeight:"bold",
        color:SECONDARY_COLOR
    },
    primaryButton : {
        backgroundColor:BUTTON_COLOR,
        padding:"5%",
        width:"70%",
        borderRadius:10,
    },
    secondaryText:{
        textAlign:"center",
        fontSize:17,
        fontWeight:"bold",
        color:BUTTON_COLOR
    }
});