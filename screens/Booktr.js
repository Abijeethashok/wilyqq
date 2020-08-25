import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import db from '../config.js'
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import firebase from 'firebase'
import { Transition } from 'react-native-reanimated';



export default class Booktransactionscreen extends React.Component{
    constructor(){
        super()
        this.state = {hascamerapermissinos: null,scaned :false,scanedData:'',buttonstate: 'normal',Transactionmessage :"",scanedstudentID : "",scanedbookID: ""}
    }
     getcamerapermissions = async(ID)=>{
         const {status} = await Permissions.askAsync(Permissions.CAMERA)
         this.setState({
             hascamerapermissinos:status === "Granted",
             buttonstate: ID,
             scaned: false
             
         })   
         
     }
     handleBarCodeScanned = async({type,data})=>
     {
         const {buttonstate} = this.state.buttonstate
         if(buttonstate === "bookID"){
            this.setState({scaned:true,scanedbookID:data,buttonstate :'normal'})
         }
         else if(buttonstate === "studentID"){
            this.setState({scaned:true,scanedstudentID:data,buttonstate :'normal'})} 
         }

       initiatebookissue = async()=>{
        db.collection("transaction").add({
            'studentId' : this.state.scanedstudentID,
            'bookID' : this.state.scanedbookID,
            'transactionType' : "issue",
            'Date' : firebase.firestore.Timestamp.now().toDate()
        })
        db.collection("books").doc(this.state.scanedbookID).update({
            'bookAvailability' : false
        })
        db.collection("students").doc(this.state.scanedstudentID).update({
            'noOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
        })
        this.setState({scanedbookID : '',scanedstudentID : ''})
        Alert.alert("Book issued")
       }  


       initiatebookreturn = async()=>{
        db.collection("transaction").add({
            'studentId' : this.state.scanedstudentID,
            'bookID' : this.state.scanedbookID,
            'transactionType' : "return",
            'Date' : firebase.firestore.Timestamp.now().toDate()
        })
        db.collection("books").doc(this.state.scanedbookID).update({
            'bookAvailability' : true
        })
        db.collection("students").doc(this.state.scanedstudentID).update({
            'noOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({scanedbookID : '',scanedstudentID : ''})
        Alert.alert("Book returned")
       }  

       checkBookIligblity= async()=>{
           const bookref = await db.collection("books ").where("bookId","==",this.state.scanedbookID).get()
           console.log(this.state.scanedbookID)
           
           var transactionType = ""
           if(bookref.docs.length === 0){
               console.log("bookreflengthzero")
               transactionType = false
           }
           else{
            bookref.docs.map(doc=>{
                var book = doc.data()
                if(book.bookAvailability){
                    transactionType = "Issue"
                }
                else{transactionType = "Return"}
            })
           }
           console.log(transactionType)
           return transactionType
        }
         checkstudentEleforbookise = async()=>{
             const studentref = await db.collection("students").where("studentId","==",this.state.scanedstudentID).get()
            var isStudent = ""
            if(studentref.docs.length === 0){
                isStudent = false
                this.setState({
                    scanedstudentID : "",
                    scanedbookID : ""
                })
            }
            else{studentref.docs.map(doc=>{
                var students = doc.data()
                if(students.noOfBooksIssued < 2){
                    isStudent = true
                }
                else{
                    isStudent = false
                    alert("student has receved 2 books ")
                    this.setState({
                        scanedbookID : "",
                        scanedstudentID : ""
                    })
                }
            })}
            return isStudent
         }

         checkstudentEleforbookreturn = async()=>{
             const transactionref = await db.collection("transactions").where("bookId","==",this.state.scanedbookID).limit(1).get()
             var isStudent = ""
             transactionref.docs.map(doc=>{
                 var lastBook = doc.data()
                 if(lastBook.studentId === this.scanedstudentID){
                     isStudent = true
                 }
                 else{
                     isStudent= false
                     alert("the book was not issued by this student")
                     this.setState({
                         scanedbookID : "",
                         scanedstudentID : ""
                     })
                 }
             })

         }
         


      handleTransaction = async()=>{
          var transactionType = await this.checkBookIligblity()
          if(!transactionType){
              alert("This book is not there in lab")
              this.setState({
                  scanedstudentID : "",scanedbookID : "" 
              })
          }
         else if(transactionType === "Issue"){
             var isStudent = await this.checkstudentEleforbookise()
             if(isStudent){
                this.initiatebookissue()
                alert("book ISSUED")
             }
             
         }
         else{
             var isStudent = await this.checkstudentEleforbookreturn()
             if(isStudent){
            this.initiatebookreturn()
            alert("BOOK return")
        }
         }

      /*   console.log("error.error")
        var Transactionmessage
        db.collection("books").doc(this.state.scanedbookID).get()
        .then((doc)=>{
            var book = doc.data()
            if (book.bookAvailability){
                console.log("ASDFGHJKL")
             this.initiatebookissue()
             Transactionmessage = "Book issued"
             ToastAndroid.show(Transactionmessage,ToastAndroid.SHORT)
            alert("book ISSUED")
            }
            else{
                this.initiatebookreturn()
                Transactionmessage = "Book return"
            ToastAndroid.show(Transactionmessage,ToastAndroid.SHORT)
              alert("BOOK return")
            }
          this.setState({
              Transactionmessage : Transactionmessage
          })
        })*/
      }
    




    render(){
        console.log("RENDERRENDER")
        const hascamerapermissinos = this.state.hascamerapermissinos;
        const buttonstate = this.state.buttonstate;
        const scanned = this.state.buttonstate;

        if (buttonstate === "clicked" && hascamerapermissinos){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}></BarCodeScanner>)
        }
        else if (buttonstate === "normal"){
        return(
            <KeyboardAvoidingView style = {styles.container} behavior = "padding" enabled >
            <View> 
        <View style = {styles.inputview}>
            <TextInput style= {styles.inputbox}
            placeholder = "Book ID"
            onChangeText = {text=>this.setState({
                scanedbookID : text
            })}
            value = {this.state.scanedbookID}
            ></TextInput>
            <TouchableOpacity style = {styles.scanButton}
            onPress = {()=>{this.getcamerapermissions("bookID")}}>
                <Text>SCAN</Text>
            </TouchableOpacity>
            </View>
            <View style = {styles.inputview}>
            <TextInput style = {styles.inputbox}
            placeholder = "Student ID"
            onChangeText = {text=>this.setState({
                scanedstudentID : text
            })}
            value = {this.state.scanedstudentID}
            ></TextInput>
             <TouchableOpacity style = {styles.scanButton}
            onPress = {()=>{this.getcamerapermissions("studentID")}}>
                <Text>SCAN</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.submitButton}
            onPress = {async()=>{this.handleTransaction()}}>
                <Text>SUBMIT</Text>
            </TouchableOpacity>
            </View>

        </View>
        </KeyboardAvoidingView>
        )}
    }
}

const styles = StyleSheet.create({
     displayText : {fontSize: 15,textDecorationLine : 'underline'},

     scanButton : {backgroundColor : 'red',padding:10,margin:10},

     buttontext : {fontSize :15,textAlign :"center",marginTop : 10},

     inputview : {flexDirection : 'column',margin  :20},

     inputbox : {width:250,height : 40,borderWidth :1.5,borderRightWidth :0,fontSize:20},

     container : {flex :1,justifyContent :"center",alignItems : "center"}
    })
