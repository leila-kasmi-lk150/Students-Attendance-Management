import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Presence = ({ route, navigation }: { route: any, navigation: any }) => {
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  const {session_id} = route.params;
  function example() {
    Alert.alert(session_id)
  }
  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity  onPress={() => {example()}}>
        <Text >Presence</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Presence

const styles = StyleSheet.create({})