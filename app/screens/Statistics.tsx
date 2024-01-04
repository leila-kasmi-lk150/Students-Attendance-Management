import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Statistics = ({ route, navigation }: { route: any, navigation: any }) => {
  const { class_id } = route.params;
  const { class_name } = route.params;
  const { class_speciality } = route.params;
  const { class_level } = route.params;
  const { group_id } = route.params;
  const { group_name } = route.params;
  const { group_type } = route.params;
  function example() {
    Alert.alert(group_name)
  }
  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity  onPress={() => {example()}}>
        <Text >Statistics</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Statistics

const styles = StyleSheet.create({})