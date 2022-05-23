import React, { useState, useEffect }  from 'react';
import {  View,Image,Text,TouchableOpacity,Modal } from 'react-native';
import Svg, {Rect} from 'react-native-svg';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as blazeface from '@tensorflow-models/blazeface';
import * as jpeg from 'jpeg-js'
import * as ImagePicker from 'expo-image-picker';
import { primaryStyle } from '../styles/globStyles';
import * as FileSystem from 'expo-file-system';
import { Buffer } from "buffer";
import ChoiceModal from '../Components/ChoiceModal';

export default function ImageDetector(){
    	
    const [faces,setFaces]=useState([])
    const [faceDetector,setFaceDetector]=useState("")
    const [maskDetector,setMaskDetector]=useState("")
	const [image, setImage] = useState(null);
	const [show,setShow]  = useState(false)
	const [loading,setLoading]  = useState(false)

    useEffect(() => {

        async function loadModel(){
          console.log("[+] Application started")
          //Wait for tensorflow module to be ready
          await tf.ready();
          console.log("[+] Loading custom mask detection model")
          //Replce model.json and group1-shard.bin with your own custom model

          const modelJSON = require("../assets/models/model.json");

		  const modelWeights1 = require("../assets/models/group1-shard1of3.bin")
          const modelWeights2 = require("../assets/models/group1-shard2of3.bin")
          const modelWeights3 = require("../assets/models/group1-shard3of3.bin")

          const maskDetector = await tf.loadGraphModel(bundleResourceIO(modelJSON,[modelWeights1,modelWeights2,modelWeights3]));
          console.log("[+] Loading pre-trained face detection model")

          //Blazeface is a face detection model provided by Google
          const faceDetector =  await blazeface.load();
          //Assign model to variable
          setMaskDetector(maskDetector)
          setFaceDetector(faceDetector)

          console.log("[+] Model Loaded")
        }
        loadModel()

    }, []); 


	async function pickImage () {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing : true,
			aspect: [1, 1],
			quality: 1,
		});
		
		if (!result.cancelled) {
			setFaces([])
		 	setImage(result.uri);
		}
	}

	async function openCamera () {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.cancelled) {
			setFaces([])
			setImage(result.uri);
		}
    }

    function imageToTensor(rawImageData){
      	//Function to convert jpeg image to tensors
		const TO_UINT8ARRAY = true;
		const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
		// Drop the alpha channel info for mobilenet
		const buffer = new Uint8Array(width * height * 3);
		let offset = 0; // offset into original data
		for (let i = 0; i < buffer.length; i += 3) {
			buffer[i] = data[offset];
			buffer[i + 1] = data[offset + 1];
			buffer[i + 2] = data[offset + 2];
			offset += 4;
		}
		return tf.tensor3d(buffer, [height, width, 3]);
    }



    const getFaces = async() => {
      try{
		
		setLoading(true)
        console.log("[+] Retrieving image from link :"+image)
  
		const response = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
		const rawImageData = Buffer.from(response, "base64");

        const imageTensor = imageToTensor(rawImageData).resizeBilinear([224,224])
        const faces = await faceDetector.estimateFaces(imageTensor, false);
        var tempArray=[]

        for (let i=0;i<faces.length;i++){
			let color = "red"
			let width = parseInt((faces[i].bottomRight[1] - faces[i].topLeft[1]))
			let height = parseInt((faces[i].bottomRight[0] - faces[i].topLeft[0]))
			let faceTensor = imageTensor.slice([parseInt(faces[i].topLeft[1]),parseInt(faces[i].topLeft[0]),0],[width,height,3])
			faceTensor = faceTensor.resizeBilinear([224,224]).reshape([1,224,224,3])
			let result = await maskDetector.predict(faceTensor).data()
			console.log(result)
			let accurracy = result[0]

			if(result[0] < result[1]){
				color="green"
				accurracy = result[1]
			}
			tempArray.push({
				id:i,
				location:faces[i],
				color:color,
				acc : accurracy
			})
        }
        setFaces(tempArray)
        console.log("[+] Prediction Completed")
		setLoading(false)
      }catch{
        console.log("[-] Unable to load image")
      }
      
    }


	if(!loading){
  	return ( 
    <View style={primaryStyle.container}>
		
		<Modal visible={show} animationType="fade" transparent>
			<ChoiceModal openCamera={openCamera} setShow={setShow} pickImage={pickImage} />
		</Modal>
		<View style={{flex:1,width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
		
		<TouchableOpacity style={primaryStyle.primaryButton} onPress={()=>setShow(true)}>
		  		<Text style={primaryStyle.primaryText}>Charger une image</Text>
		</TouchableOpacity>

        <View style={{margin:"15%"}}>
            {
				image && 
				<Image
					style={{width:224,height:224,borderRadius:10,resizeMode: "contain"}}
					source={{
						uri: image
					}}
					PlaceholderContent={<View>No Image Found</View>}
            	/>
			}
            <Svg height="224" width="224" style={{marginTop:-224}}>
            {
                faces.map((face)=>{
					return (
						<Rect
							key={face.id}
							x={face.location.topLeft[0]}
							y={face.location.topLeft[1]}
							width={(face.location.bottomRight[0] - face.location.topLeft[0])}
							height={(face.location.bottomRight[1] - face.location.topLeft[1])}
							stroke={face.color}
							strokeWidth="2"
							fill="transparent"
							
						
						/>
					)
                })
            }   
            </Svg>
			{
				faces.map((face)=>{
					return(
						<Text key={face.id} style={{
						
							color:face.color,
							position:"absolute",
							left:face.location.topLeft[0],
							top:face.location.bottomRight[1],
							fontWeight:"bold",
							marginLeft:((face.location.bottomRight[0] - face.location.topLeft[0])/2)-10,
						}}
						
						>
							{(face.acc*100).toFixed(2)} %
						</Text>
					)
				})
			}

        </View>

        <TouchableOpacity style={primaryStyle.primaryButton}  onPress={getFaces}>
			<Text style={primaryStyle.primaryText}>Predire</Text>
		</TouchableOpacity> 

		</View>
    </View>
  );
	}else{return <View style={primaryStyle.container}><Text style={primaryStyle.primaryText}>Traitement en cours ...</Text></View>}
}
