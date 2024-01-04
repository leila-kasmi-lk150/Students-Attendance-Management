import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';


const Presence = ({ route, navigation }: { route: any, navigation: any }) => {
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
    <SafeAreaView style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
      {/* header  */}
      <View style={{ flexDirection: 'row' }}>
        <Ionicons name="ios-arrow-back" size={25} color="#05BFDB" style={{ top: 10, marginRight: 15 }}
          onPress={() => navigation.navigate('Group',
            { class_id: class_id, class_name: class_name, class_speciality: class_speciality, class_level: class_level })}
        />
        <Text style={{ flex: 1, fontSize: 25, fontWeight: '700' }}>{class_name} {group_name} {group_type}</Text>
      </View>
    </SafeAreaView>
  )
}

export default Presence

const styles = StyleSheet.create({})