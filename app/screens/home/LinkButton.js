import { StyleSheet, View } from 'react-native'
import LinkFunction from './LinkFunction';
import React from 'react'

const LinkButton = () => {
  return (
    <View>
          <LinkFunction
            href="/screens/Find"
            title="Find location!"
            options={{ headerShown: false }}
          />
          <LinkFunction
            href="/screens/catch"
            title="Generate code"
            options={{ headerShown: false }}
          />
          <LinkFunction
            href="/screens/tutorial"
            title="Tutorial"
            options={{ headerShown: false }}
          />
        </View>
  )
}

export default LinkButton

const styles = StyleSheet.create({})