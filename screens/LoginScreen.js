 import React from 'react'
 import {View,StyleSheet,TextInput,TouchableOpacity,Text, Alert} from 'react-native'
 
 


 export default class LoginScreen extends React.Component{
     constructor(){
         super()
         this.state = {emailId : '',password : ''}
     }

     login = async(email,password)=>{
         Alert.alert("INLOGIN")
         if(email&&password){
             try{
             const response = await firebase.auth().signInWithEmailAndPassword(email,password)
             if(response){
                 this.props.navigation.navigate('Transaction')
             }}
             catch(error){
                 switch(error.code){
                     case'auth/user-not-found':Alert.alert("user dose't exist");break;
                     case'auth/invalid-email':Alert.alert("invalid email ID");break;
                    
                 }
             }
         }
         else{Alert.alert("Please enter email and password")}
     }
     render(){
         return(<View>
             <View>
          <TextInput style = {styles.loginbox}
          placeholder = "abc@example.com"
          keyboardType = "email-address"
          onChangeText = {(text)=>{this.setState({
              emailId : text
          })}}>
              
              </TextInput>  

              <TextInput style = {styles.loginbox}
          placeholder = "ENTER PASSWORD"
          secureTextEntry = {true}
          onChangeText = {(text)=>{this.setState({
              password : text
          })}}>
              
              </TextInput>

         </View>
         <View>
<TouchableOpacity style = {{height:30,width:90,borderWidth:1,marginTop:20,paddingTop:5,borderRadius:7}}
onPress={()=>{this.login(this.state.emailId,this.state.password)}}>
    <Text>LOGIN.....</Text>
</TouchableOpacity>


         </View>
         </View>
         )
         

     }
 }
const styles = StyleSheet.create({
    loginbox:{width:300,
    height:40,
    borderWidth:1.5,
    fontSize:20,
    margin:10,
    paddingLeft:10}
})