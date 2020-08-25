import React from 'react';
import { StyleSheet, Text, View,FlatList, TextInput,TouchableOpacity} from 'react-native';



export default class  Searchscreen extends React.Component{
    constructor(props){
        super(props)
        this.state = {AllTransactions : [],lastvisibletransacton : null, search : ''}
    }
    render(){
        return(
            <View>
                <TextInput style = {styles.bar}
                placeholder = "ENTER bookID or studentID"
                onChangeText = {(Text)=>{this.setState({search : Text})}}>
                </TextInput>
                <TouchableOpacity style = {styles.searchButton}
                onPress = {this.searchtransaction(this.state.search)}>
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>
        )
    }
}