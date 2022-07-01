import { StyleSheet,View,Text,Dimensions,LogBox } from "react-native";
import { BUTTON_COLOR,primaryStyle } from "../styles/globStyles";
import * as tf from '@tensorflow/tfjs';
import React,{ useEffect,useState,useRef } from "react";
import { bundleResourceIO,cameraWithTensors } from "@tensorflow/tfjs-react-native";
import { Camera } from 'expo-camera';
import * as blazeface from "@tensorflow-models/blazeface"
import Canvas from 'react-native-canvas';
import { Ionicons } from '@expo/vector-icons'; 

const { width, height } = Dimensions.get("window");
LogBox.ignoreAllLogs(true);

const TensorCamera = cameraWithTensors(Camera);


export default function Detection() {

    const [maskDetector,setMaskDetector]=useState("")
    const [faceDetector,setFaceDetector]=useState("")
    const [turnIt,setTurnIt]=useState(true)


    let context = useRef();
    let canvas = useRef();

    useEffect(() => {

        async function loadModel(){
            console.log("[+] Application started")
            //Wait for tensorflow module to be ready
            await tf.ready();
            console.log("[+] Loading custom mask detection model")
            //Replce model.json and group1-shard.bin with your own custom model
            
			const modelJSON = require("../assets/models/model.json");
			const modelWeights = require("../assets/models/group1-shard1of1.bin")
       
			const maskDetector = await tf.loadGraphModel(bundleResourceIO(modelJSON,modelWeights));
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
  

    async function handleCanvas(can) {
        if (can) {
            can.width = width;
            can.height = height;
            const ctx = can.getContext("2d");
            ctx.lineWidth = 2;

            context.current = ctx;
            canvas.current = can;
        }
    }



    function handleCameraStream(images) {
        
        const loop = async () => {
            try {
                const nextImageTensor = images.next().value;
                if (!maskDetector || !nextImageTensor)
                    throw new Error("Model or image not loaded");
            
                const faces = await faceDetector.estimateFaces(nextImageTensor, false);
                let tempArray = []
                for (let i=0;i<faces.length;i++) {
                    try {
                        let color = "red"
                        let width = parseInt((faces[i].bottomRight[1] - faces[i].topLeft[1]))
                        let height = parseInt((faces[i].bottomRight[0] - faces[i].topLeft[0]))
                        let faceTensor = nextImageTensor.slice([parseInt(faces[i].topLeft[1]),parseInt(faces[i].topLeft[0]),0],[width,height,3])
                        faceTensor = faceTensor.resizeBilinear([224,224]).reshape([1,224,224,3]).div(255)
                        .sub([0.485, 0.456, 0.406])
                        .div([0.229, 0.224, 0.225]);

                        let result = await maskDetector.predict(faceTensor).dataSync()
                        let classDetected

                        console.log(result)
                        
                        if(result[0] > result[1]){
                            classDetected = `Mask    ${result[0].toFixed(2)*100}%`
                            color="green"
                            console.log("Mask")
                        }
                        else{
                            classDetected = `No Mask    ${result[1].toFixed(2)*100}%`
                            console.log("No Mask")
                        }
                        
                        const detection = {
                            id:i,
                            color:color,
                            width :width*2,
                            x : faces[i].topLeft[0]*1.1,
                            y : faces[i].topLeft[1]*2.2,
                            height : height*2,
                            class : classDetected,
                        }
                        tempArray.push(detection)

                    } catch (error) {
                        console.log(error.message)
                    }
                }
                drawRectangle(tempArray)
                requestAnimationFrame(loop);

            } catch (error) {
                console.log(error.message)
            }
            
        };
        loop();
    }
 

    function drawRectangle(tempArray) {
        if (!context.current || !canvas.current) 
            return;
            
        context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);


        for (const predictions of tempArray ) {
            const {x, y, width, height,color} = predictions

            context.current.font = '18px Arial';

            // context.current.strokeStyle = color
            // context.current.font = '18px Arial';
            // context.current.beginPath();   
            // context.current.fillStyle = color
            // context.current.fillText(predictions.class, x, y);
            // context.current.rect(x, y, width, height); 
            // context.current.stroke();

            context.current.strokeStyle=color
            context.current.strokeRect(
                x,
                y,
                width ,
                height ,
            );

            context.current.strokeText(
                predictions.class,
                x + 20,
                y - 10
            );
        }


    }

    return (
        maskDetector ? (
        <View style={primaryStyle.container}>
            <TensorCamera
                style={styles.camera}
                type={turnIt ? Camera.Constants.Type.front : Camera.Constants.Type.back}
                resizeHeight={224}
                resizeWidth={224}
                resizeDepth={3}
                onReady={handleCameraStream}
                autorender={true}
            />
            <Canvas style={styles.canvas} ref={handleCanvas} />
            <Ionicons name="ios-camera-reverse" style={{marginTop:"3%"}} size={50} onPress={()=>{setTurnIt(!turnIt)}} color={BUTTON_COLOR}/>
        </View>
        ):(
            <View style={primaryStyle.container} >
                <Text style={primaryStyle.primaryText}>Loading...</Text>
            </View>
        )
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    camera: {
        borderRadius:10,
        width: "90%",
        height: "80%",
    },
    canvas: {
        position: "absolute",
        zIndex: 100000000,
        flex:1,
        width: "90%",
        height: "80%",
    },
});


// tensorflowjs_converter --input_format keras --weight_shard_size_bytes 60000000 path_to_model.h5 path_to_save
