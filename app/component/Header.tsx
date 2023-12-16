import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

const Header = ({ headerText: string, headerIcon: string }) => {
  return (
    <View>
      <Text>{headerText}</Text>
      <FontAwesome icon={headerIcon} size={24} color="#05BFDB"/>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})